import { PostHttp } from "../http"


export const AuthorizeUser = (payload) => {
    return PostHttp("/authorize", payload, false)
}

export const GenerateAuthToken = (payload) => {
    return PostHttp("/token", payload, false)
}