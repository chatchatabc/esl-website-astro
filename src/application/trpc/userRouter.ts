import {
  trpcProcedure,
  trpcRouterCreate,
} from "src/domain/infra/trpcServerActions";
import type { CommonParams } from "src/domain/models/CommonModel";
import type {
  UserContactInformation,
  UserPersonalInformation,
} from "src/domain/models/UserModel";
import {
  userGet,
  userGetAll,
  userGetPhoneToken,
  userUpdateProfile,
  userValidatePhoneToken,
} from "src/domain/services/server/userService";
import {
  utilFailedResponse,
  utilValidateCommonParams,
} from "src/domain/services/server/utilService";

export default trpcRouterCreate({
  get: trpcProcedure
    .input((values) => {
      const data = values as { userId: number };
      return data;
    })
    .query((opts) => {
      return userGet(opts.input, opts.ctx.env);
    }),

  getAll: trpcProcedure
    .input((values) => {
      return utilValidateCommonParams(values as CommonParams);
    })
    .query(async (opts) => {
      return userGetAll(opts.input, opts.ctx.env);
    }),

  getProfile: trpcProcedure.query((opts) => {
    return userGet({ userId: opts.ctx.userId ?? 0 }, opts.ctx.env);
  }),

  updateProfile: trpcProcedure
    .input((values: any) => {
      if (!values) {
        throw utilFailedResponse("Missing values", 400);
      }

      if (
        !values.firstName ||
        !values.lastName ||
        !values.email ||
        !values.phone
      ) {
        throw utilFailedResponse("Missing values", 400);
      }

      const data = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
      } as UserPersonalInformation & UserContactInformation & { id?: number };

      return data;
    })
    .mutation((opts) => {
      const id = opts.ctx.userId ?? 0;
      opts.input.id = id;
      console.log(id);
      return userUpdateProfile(opts.input, opts.ctx.env);
    }),

  getPhoneToken: trpcProcedure.query((opts) => {
    const id = opts.ctx.userId ?? 0;
    return userGetPhoneToken({ userId: id }, opts.ctx.env);
  }),

  validatePhoneToken: trpcProcedure
    .input((values) => {
      const data = values as { token: string };
      return data;
    })
    .mutation((opts) => {
      const data = {
        token: opts.input.token,
        userId: opts.ctx.userId ?? 0,
      };
      return userValidatePhoneToken(data, opts.ctx.env);
    }),
});
