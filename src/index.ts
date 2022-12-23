import path from "path";
import Bree from "bree";

const jobsPath = path.join(__dirname, "../jobs");

const bree = new Bree({
  jobs: [
    {
      name: "sendEmail",
      path: `${jobsPath}/sendEmail.js`,
      interval: "10s",
    },
    {
      name: "test",
      path: `${jobsPath}/test.js`,
      timeout: "5s",
      interval: "every 2 seconds",
      worker: {
        workerData: {
          name: "Eda",
        },
      },
    },
  ],
});

export { bree };
