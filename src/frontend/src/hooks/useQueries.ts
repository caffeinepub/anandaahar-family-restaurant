import { useMutation, useQuery } from "@tanstack/react-query";
import type { MenuItem, OrderItem } from "../backend.d";
import { useActor } from "./useActor";

export function useGetMenuItems() {
  const { actor, isFetching } = useActor();
  return useQuery<MenuItem[]>({
    queryKey: ["menuItems"],
    queryFn: async () => {
      if (!actor) return [];
      await actor.seedMenu();
      return actor.getMenuItems();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      customerName,
      phone,
      items,
    }: {
      customerName: string;
      phone: string;
      items: OrderItem[];
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.placeOrder(customerName, phone, items);
    },
  });
}

export function useCreateBooking() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      customerName,
      phone,
      date,
      time,
      guestCount,
    }: {
      customerName: string;
      phone: string;
      date: string;
      time: string;
      guestCount: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createBooking(customerName, phone, date, time, guestCount);
    },
  });
}
