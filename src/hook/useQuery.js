import { useMutation } from "@tanstack/react-query";
import { loginUser, registerUser } from "../api/axios";

export const useLogin = () => useMutation({
  mutationFn: loginUser
});

export const useRegister = () => useMutation({
  mutationFn: registerUser
});
