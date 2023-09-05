import { Snowflake } from "./utils";

const workerId = 1; // 机器 ID
const dataCenterId = 1; // 数据中心 ID

export const snowflake = new Snowflake(workerId, dataCenterId);

