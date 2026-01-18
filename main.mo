import AccessControl "authorization/access-control";
import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";
import VarArray "mo:core/VarArray";

actor {
  let accessControlState = AccessControl.initState();

  type UserRole = AccessControl.UserRole;

  type TripStatus = {
    #pending;
    #inProgress;
    #completed;
    #canceled;
    #emergency;
  };

  type Location = {
    latitude : Float;
    longitude : Float;
  };

  type ChildProfile = {
    name : Text;
    grade : Text;
    allergies : ?Text;
    emergencyContact : Text;
    parentId : Principal;
  };

  type TripRequest = {
    id : Text;
    parentId : Principal;
    childrenIds : [Text];
    pickupLocation : Location;
    dropoffLocation : Location;
    scheduledTime : Time.Time;
    status : TripStatus;
    driverId : ?Principal;
  };

  type ChatMessage = {
    sender : Principal;
    receiver : Principal;
    message : Text;
    timestamp : Time.Time;
  };

  type UserUpdate = {
    name : ?Text;
    phone : ?Text;
    role : ?UserRole;
  };

  module ChildProfile {
    public func compare(a : ChildProfile, b : ChildProfile) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  module TripRequest {
    public func compare(a : TripRequest, b : TripRequest) : Order.Order {
      Text.compare(a.id, b.id);
    };
  };

  let childProfiles = Map.empty<Text, ChildProfile>();
  let tripRequests = Map.empty<Text, TripRequest>();
  let chatMessages = Map.empty<Text, List.List<ChatMessage>>();
  let driverLocations = Map.empty<Principal, Location>();

  public shared ({ caller }) func createTripRequest(
    childrenIds : [Text],
    pickupLocation : Location,
    dropoffLocation : Location,
    scheduledTime : Time.Time,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only authenticated users can create trip requests");
    };

    let requestId = createTripRequestId(caller);

    let trip : TripRequest = {
      id = requestId;
      parentId = caller;
      childrenIds;
      pickupLocation;
      dropoffLocation;
      scheduledTime;
      status = #pending;
      driverId = null;
    };

    tripRequests.add(requestId, trip);
    requestId;
  };

  func createTripRequestId(caller : Principal) : Text {
    let now = Time.now();
    let callerText = caller.toText();
    callerText # "_" # now.toText();
  };

  public query ({ caller }) func getTripStatus(tripId : Text) : async TripStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only authenticated users can view trip status");
    };

    switch (tripRequests.get(tripId)) {
      case (null) { Runtime.trap("Trip not found") };
      case (?trip) {
        if (trip.parentId != caller and trip.driverId != ?caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Can only view your own trips");
        };
        trip.status;
      };
    };
  };

  public shared ({ caller }) func updateTripStatus(tripId : Text, status : TripStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only authenticated users can update trip status");
    };

    let trip = switch (tripRequests.get(tripId)) {
      case (null) { Runtime.trap("Trip not found") };
      case (?trip) { trip };
    };

    if (trip.driverId != ?caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Only assigned driver or admin can update trip status");
    };

    let updatedTrip = {
      trip with
      status;
    };

    tripRequests.add(tripId, updatedTrip);
  };

  public shared ({ caller }) func assignTripToDriver(tripId : Text, driverId : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Only admins can assign drivers to trips");
    };

    let trip = switch (tripRequests.get(tripId)) {
      case (null) { Runtime.trap("Trip not found") };
      case (?trip) { trip };
    };

    let updatedTrip = {
      trip with
      driverId = ?driverId;
    };

    tripRequests.add(tripId, updatedTrip);
  };

  public query ({ caller }) func getAllTripRequests() : async [TripRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Only admins can view all trip requests");
    };
    tripRequests.values().toArray().sort();
  };

  public query ({ caller }) func getTripRequestsByParent(parentId : Principal) : async [TripRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only authenticated users can view trip requests");
    };

    // Parents can view their own trips, drivers can view trips assigned to them, admins can view any
    if (caller != parentId and not AccessControl.isAdmin(accessControlState, caller)) {
      // Check if caller is a driver assigned to any of this parent's trips
      var isAssignedDriver = false;
      for (trip in tripRequests.values()) {
        if (trip.parentId == parentId and trip.driverId == ?caller) {
          isAssignedDriver := true;
        };
      };
      if (not isAssignedDriver) {
        Runtime.trap("Can only view your own trip requests or trips assigned to you as driver");
      };
    };

    let parentTrips = List.empty<TripRequest>();
    for (trip in tripRequests.values()) {
      if (trip.parentId == parentId) {
        parentTrips.add(trip);
      };
    };
    parentTrips.toArray().sort();
  };

  public query ({ caller }) func getTripsOverview(parentId : Principal) : async [{
    tripId : Text;
    childId : Text;
    currentStatus : TripStatus;
  }] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only authenticated users can view trip requests");
    };

    // Parents can view their own trips, drivers can view trips assigned to them, admins can view any
    if (caller != parentId and not AccessControl.isAdmin(accessControlState, caller)) {
      // Check if caller is a driver assigned to any of this parent's trips
      var isAssignedDriver = false;
      for (trip in tripRequests.values()) {
        if (trip.parentId == parentId and trip.driverId == ?caller) {
          isAssignedDriver := true;
        };
      };
      if (not isAssignedDriver) {
        Runtime.trap("Can only view your own trip requests or trips assigned to you as driver");
      };
    };

    let parentTrips = List.empty<TripRequest>();
    for (trip in tripRequests.values()) {
      if (trip.parentId == parentId) {
        parentTrips.add(trip);
      };
    };

    let tripOverviews = parentTrips.toArray().map(
      func(trip) {
        trip.childrenIds.map(
          func(childId) {
            {
              tripId = trip.id;
              childId;
              currentStatus = trip.status;
            };
          }
        );
      }
    ).flatten();

    tripOverviews;
  };

  public query ({ caller }) func getTripRequestsByDriver(driverId : Principal) : async [TripRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only authenticated users can view trip requests");
    };

    if (caller != driverId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Can only view your own assigned trips");
    };

    let driverTrips = List.empty<TripRequest>();
    for (trip in tripRequests.values()) {
      if (trip.driverId == ?driverId) {
        driverTrips.add(trip);
      };
    };
    driverTrips.toArray().sort();
  };

  public shared ({ caller }) func updateDriverLocation(location : Location) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only authenticated users can update location");
    };

    driverLocations.add(caller, location);
  };

  public type LocationWithDriver = {
    #none;
    #parentId : Principal;
    #driverId : Principal;
  };

  public query ({ caller }) func getDriverLocation(driverId : Principal) : async ?Location {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only authenticated users can view driver location");
    };

    if (caller != driverId and not AccessControl.isAdmin(accessControlState, caller)) {
      var hasActiveTrip = false;
      for (trip in tripRequests.values()) {
        if (trip.parentId == caller and trip.driverId == ?driverId and (trip.status == #pending or trip.status == #inProgress)) {
          hasActiveTrip := true;
        };
      };
      if (not hasActiveTrip) {
        Runtime.trap("Can only view location of drivers assigned to your active trips");
      };
    };

    driverLocations.get(driverId);
  };

  public shared ({ caller }) func createChildProfile(
    name : Text,
    grade : Text,
    allergies : ?Text,
    emergencyContact : Text,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only authenticated users can create child profiles");
    };

    let childProfile = {
      name;
      grade;
      allergies;
      emergencyContact;
      parentId = caller;
    };

    childProfiles.add(name, childProfile);
    name;
  };

  public query ({ caller }) func getChildProfile(id : Text) : async ChildProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only authenticated users can view child profiles");
    };

    switch (childProfiles.get(id)) {
      case (null) { Runtime.trap("Child not found") };
      case (?profile) {
        // Parents can view their own children, admins can view any, drivers can view children in their assigned trips
        if (profile.parentId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          var isAssignedDriver = false;
          for (trip in tripRequests.values()) {
            if (trip.driverId == ?caller) {
              for (childId in trip.childrenIds.vals()) {
                if (childId == id) {
                  isAssignedDriver := true;
                };
              };
            };
          };
          if (not isAssignedDriver) {
            Runtime.trap("Can only view your own children's profiles or assigned children as driver");
          };
        };
        profile;
      };
    };
  };

  public query ({ caller }) func getAllKidsProfiles() : async [ChildProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Only admins can view all child profiles");
    };
    childProfiles.values().toArray().sort();
  };

  public query ({ caller }) func getChildProfiles(parentId : Principal) : async [ChildProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only authenticated users can view child profiles");
    };

    // Parents can view their own children, admins can view any, drivers can view children in trips assigned to them
    if (caller != parentId and not AccessControl.isAdmin(accessControlState, caller)) {
      // Check if caller is a driver with trips for this parent
      var isAssignedDriver = false;
      for (trip in tripRequests.values()) {
        if (trip.parentId == parentId and trip.driverId == ?caller) {
          isAssignedDriver := true;
        };
      };
      if (not isAssignedDriver) {
        Runtime.trap("Can only view your own children's profiles or children in trips assigned to you");
      };
    };

    let userChildren = List.empty<ChildProfile>();
    for (child in childProfiles.values()) {
      if (child.parentId == parentId) {
        userChildren.add(child);
      };
    };
    userChildren.toArray().sort();
  };

  public shared ({ caller }) func triggerSOS(location : ?Location) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only authenticated users can trigger SOS");
    };

    let message = {
      sender = caller;
      receiver = caller;
      message = "SOS";
      timestamp = Time.now();
    };

    let messages = switch (chatMessages.get(caller.toText())) {
      case (null) {
        List.fromArray<ChatMessage>([message]);
      };
      case (?existingMessages) {
        existingMessages.add(message);
        existingMessages;
      };
    };

    chatMessages.add(caller.toText(), messages);

    switch (location) {
      case (null) {};
      case (?loc) {
        driverLocations.add(caller, loc);
      };
    };
  };

  public shared ({ caller }) func sendMessage(receiver : Principal, text : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only authenticated users can send messages");
    };

    // Verify that sender and receiver have a relationship (parent-driver through trips)
    var hasRelationship = false;

    // Check if they are in the same trip (as parent and driver)
    for (trip in tripRequests.values()) {
      if ((trip.parentId == caller and trip.driverId == ?receiver) or 
          (trip.parentId == receiver and trip.driverId == ?caller)) {
        hasRelationship := true;
      };
    };

    if (not hasRelationship and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Can only message users you have trips with");
    };

    let message = {
      sender = caller;
      receiver;
      message = text;
      timestamp = Time.now();
    };

    // Store message in both sender's and receiver's message lists for easy retrieval
    let senderKey = caller.toText() # "_" # receiver.toText();
    let receiverKey = receiver.toText() # "_" # caller.toText();

    let senderMessages = switch (chatMessages.get(senderKey)) {
      case (null) {
        List.fromArray<ChatMessage>([message]);
      };
      case (?existingMessages) {
        existingMessages.add(message);
        existingMessages;
      };
    };

    chatMessages.add(senderKey, senderMessages);
    chatMessages.add(receiverKey, senderMessages);
  };

  public query ({ caller }) func getMessages(otherUserId : Principal) : async [ChatMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only authenticated users can view messages");
    };

    // Users can view their conversation with another user, admins can view any
    if (caller != otherUserId and not AccessControl.isAdmin(accessControlState, caller)) {
      // Verify relationship through trips
      var hasRelationship = false;
      for (trip in tripRequests.values()) {
        if ((trip.parentId == caller and trip.driverId == ?otherUserId) or 
            (trip.parentId == otherUserId and trip.driverId == ?caller)) {
          hasRelationship := true;
        };
      };
      if (not hasRelationship) {
        Runtime.trap("Can only view messages with users you have trips with");
      };
    };

    let conversationKey = caller.toText() # "_" # otherUserId.toText();
    switch (chatMessages.get(conversationKey)) {
      case (null) { [] };
      case (?messages) { messages.toArray() };
    };
  };

  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : UserRole) : async () {
    // AccessControl.assignRole includes admin-only guard
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };
};
