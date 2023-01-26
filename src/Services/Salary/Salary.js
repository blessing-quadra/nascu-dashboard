import { GetHttp, PostHttp, DeleteHttp } from "../http";

export const FetchWagesSchedule = () => {
  return GetHttp("/wage/schedules?page=0&size=100", true);
};

export const FetchEachWageScheduleDetails = (id) => {
  return GetHttp(`/wage/schedule/${id}`, true);
};

export const CreateWageSchedule = (payload) => {
  return PostHttp("/wage/schedule", payload, true);
};

export const AddEmployeeToSchedule = (payload) => {
  return PostHttp("/wage", payload, true);
};

export const UploadSalaryFile = (data) => {
  return PostHttp(
    `/wage/upload?name=${data.name}&description=${data.description}&paymentDay=${data.paymentDay}&month=${data.month}&year=${data.year}`,
    data.payload,
    true
  );
};

export const PaySalary = (payload) => {
  return PostHttp("/wage/payment", payload, true);
};

export const RemoveEmployeeFromSchedule = (id) => {
  return DeleteHttp(`/wage/${id}`, true);
};

export const RemoveSalarySchedule = (id) => {
  return DeleteHttp(`/wage/schedule/${id}`, true);
};
