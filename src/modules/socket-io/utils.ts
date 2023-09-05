export class Snowflake {
  private static readonly twepoch = 1060272000; // 初始时间戳，这个可以根据实际需要调整
  private static readonly workerIdBits = 5;
  private static readonly dataCenterIdBits = 5;
  private static readonly maxWorkerId = -1 ^ (-1 << Snowflake.workerIdBits);
  private static readonly maxDataCenterId = -1 ^ (-1 << Snowflake.dataCenterIdBits);
  private static readonly sequenceBits = 12;

  private readonly workerId: number;
  private readonly dataCenterId: number;
  private sequence = 0;
  private lastTimestamp = -1;

  constructor(workerId: number, dataCenterId: number) {
    if (workerId > Snowflake.maxWorkerId || workerId < 0) {
      throw new Error(`Worker ID must be between 0 and ${Snowflake.maxWorkerId}`);
    }
    if (dataCenterId > Snowflake.maxDataCenterId || dataCenterId < 0) {
      throw new Error(`Data Center ID must be between 0 and ${Snowflake.maxDataCenterId}`);
    }
    this.workerId = workerId;
    this.dataCenterId = dataCenterId;
  }

  public nextId(): bigint {
    let timestamp = this.timeGen();

    if (timestamp < this.lastTimestamp) {
      throw new Error(`Clock is moving backwards. Rejecting requests until ${this.lastTimestamp}`);
    }

    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1) & Snowflake.sequenceBits;
      if (this.sequence === 0) {
        timestamp = this.tilNextMillis(this.lastTimestamp);
      }
    } else {
      this.sequence = 0;
    }

    this.lastTimestamp = timestamp;

    const id =
      ((timestamp - Snowflake.twepoch) << (Snowflake.workerIdBits + Snowflake.dataCenterIdBits)) |
      (this.dataCenterId << Snowflake.workerIdBits) |
      this.workerId;

    return BigInt(id);
  }

  private tilNextMillis(lastTimestamp: number): number {
    let timestamp = this.timeGen();
    while (timestamp <= lastTimestamp) {
      timestamp = this.timeGen();
    }
    return timestamp;
  }

  private timeGen(): number {
    return Date.now();
  }
}


export class UnknownError extends Error {
  constructor(message?: string) {
    super(message);
  }
}