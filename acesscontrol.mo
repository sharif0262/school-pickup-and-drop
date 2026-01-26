import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

module {
  // -----------------------------
  // User Roles
  // -----------------------------
  public type UserRole = {
    #admin;
    #user;
    #guest;
  };

  // Role hierarchy for permission checks
  let roleHierarchy : Map.Map<UserRole, Nat> = Map.fromArray([
    (#guest, 1);
    (#user, 2);
    (#admin, 3);
  ]);

  // -----------------------------
  // Access Control State
  // -----------------------------
  public type AccessControlState = {
    var adminAssigned : Bool;
    userRoles : Map.Map<Principal, UserRole>;
  };

  // Initialize empty state
  public func initState() : AccessControlState {
    {
      var adminAssigned = false;
      userRoles = Map.empty<Principal, UserRole>();
    };
  };

  // -----------------------------
  // Safe Initialization
  // First caller becomes admin, others become users
  // Idempotent and concurrency-safe
  // -----------------------------
  public func initialize(state : AccessControlState, caller : Principal) {
    if (caller.isAnonymous()) { return; };

    switch (state.userRoles.get(caller)) {
      case (?_) { return; }; // already registered
      case (null) {
        if (not state.adminAssigned) {
          state.userRoles.add(caller, #admin);
          state.adminAssigned := true;
        } else {
          state.userRoles.add(caller, #user);
        };
      };
    };
  };

  // -----------------------------
  // Get role (optional)
  // Returns ?UserRole to avoid traps
  // -----------------------------
  public func getUserRole(state : AccessControlState, caller : Principal) : ?UserRole {
    if (caller.isAnonymous()) {
      ?#guest;
    } else {
      state.userRoles.get(caller);
    };
  };

  // -----------------------------
  // Assign role (admin only)
  // Protects last admin
  // -----------------------------
  public func assignRole(state : AccessControlState, caller : Principal, user : Principal, role : UserRole) {
    if (not isAdmin(state, caller)) {
      Runtime.trap("Unauthorized: Only admins can assign roles");
    };

    // Prevent removing the last admin
    if (role != #admin) {
      let admins = Map.values(state.userRoles).filter(func(r) { r == #admin });
      if (admins.size() == 1 and state.userRoles.get(user) == ?#admin) {
        Runtime.trap("Cannot remove the last admin");
      };
    };

    state.userRoles.add(user, role);

    // Update adminAssigned flag
    if (role == #admin) {
      state.adminAssigned := true;
    };
  };

  // -----------------------------
  // Permission check using hierarchy
  // -----------------------------
  public func hasPermission(state : AccessControlState, caller : Principal, requiredRole : UserRole) : Bool {
    switch (getUserRole(state, caller)) {
      case (?role) {
        let userLevel = roleHierarchy.get(role).getOrElse(0);
        let requiredLevel = roleHierarchy.get(requiredRole).getOrElse(0);
        userLevel >= requiredLevel;
      };
      case (null) { false };
    };
  };

  // -----------------------------
  // Check if caller is admin
  // -----------------------------
  public func isAdmin(state : AccessControlState, caller : Principal) : Bool {
    switch (getUserRole(state, caller)) {
      case (?role) { role == #admin };
      case (null) { false };
    };
  };
};

