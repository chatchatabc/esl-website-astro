import { trpcClient } from "src/domain/infra/trpcClientActions";

export async function userGet(params: { userId: number }) {
  try {
    const response = await trpcClient.user.get.query(params);
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function userGetProfile() {
  try {
    const response = await trpcClient.user.getProfile.query();
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function userUpdateProfile(params: Record<string, any>) {
  const data = {
    firstName: params.firstName,
    lastName: params.lastName,
    phone: params.phone,
  };

  try {
    const response = await trpcClient.user.updateProfile.mutate(data);
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function userGetPhoneToken() {
  try {
    const response = await trpcClient.user.getPhoneToken.query();
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function userValidatePhone(params: { token: string }) {
  try {
    const response = await trpcClient.user.validatePhoneToken.mutate(params);
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}
