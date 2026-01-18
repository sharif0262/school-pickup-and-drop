import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { ChildProfile, TripRequest, ChatMessage, Location, TripStatus, UserProfile } from '../backend';
import { Principal } from '@icp-sdk/core/principal';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Child Profile Queries
export function useGetChildProfiles() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<ChildProfile[]>({
    queryKey: ['childProfiles', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getChildProfiles(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useCreateChildProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; grade: string; allergies: string | null; emergencyContact: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createChildProfile(data.name, data.grade, data.allergies, data.emergencyContact);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['childProfiles'] });
    },
  });
}

export function useGetChildProfile(childId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<ChildProfile | null>({
    queryKey: ['childProfile', childId],
    queryFn: async () => {
      if (!actor || !childId) return null;
      return actor.getChildProfile(childId);
    },
    enabled: !!actor && !isFetching && !!childId,
  });
}

// Trip Request Queries
export function useGetTripRequestsByParent() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<TripRequest[]>({
    queryKey: ['tripRequests', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getTripRequestsByParent(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useCreateTripRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      childrenIds: string[];
      pickupLocation: Location;
      dropoffLocation: Location;
      scheduledTime: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTripRequest(
        data.childrenIds,
        data.pickupLocation,
        data.dropoffLocation,
        data.scheduledTime
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tripRequests'] });
    },
  });
}

export function useGetTripStatus(tripId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<TripStatus | null>({
    queryKey: ['tripStatus', tripId],
    queryFn: async () => {
      if (!actor || !tripId) return null;
      return actor.getTripStatus(tripId);
    },
    enabled: !!actor && !isFetching && !!tripId,
    refetchInterval: 5000, // Poll every 5 seconds for real-time updates
  });
}

export function useUpdateTripStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { tripId: string; status: TripStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTripStatus(data.tripId, data.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tripRequests'] });
      queryClient.invalidateQueries({ queryKey: ['tripStatus'] });
      queryClient.invalidateQueries({ queryKey: ['allTripRequests'] });
    },
  });
}

export function useGetAllTripRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<TripRequest[]>({
    queryKey: ['allTripRequests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTripRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

// Driver Location Queries
export function useUpdateDriverLocation() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (location: Location) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateDriverLocation(location);
    },
  });
}

export function useGetDriverLocation(driverId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Location | null>({
    queryKey: ['driverLocation', driverId],
    queryFn: async () => {
      if (!actor || !driverId) return null;
      return actor.getDriverLocation(Principal.fromText(driverId));
    },
    enabled: !!actor && !isFetching && !!driverId,
    refetchInterval: 3000, // Poll every 3 seconds for real-time tracking
  });
}

// Chat Queries
export function useGetMessages() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<ChatMessage[]>({
    queryKey: ['messages', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getMessages(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
    refetchInterval: 5000, // Poll every 5 seconds for new messages
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { receiver: string; text: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessage(Principal.fromText(data.receiver), data.text);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
}

// SOS Alert
export function useTriggerSOS() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (location: Location | null) => {
      if (!actor) throw new Error('Actor not available');
      return actor.triggerSOS(location);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
}
