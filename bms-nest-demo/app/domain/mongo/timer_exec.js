'use strict';

// 定时器执行
module.exports = app => {
  const mongoose = app.mongoose;

  const timerExecSchema = new mongoose.Schema({
    timer_type: {
      type: String,
    },

    exec_time: {
      begin: {
        type: String,
      },
      end: {
        type: String,
      },
    },

    desc: {
      type: String,
    },

    time_rng: {
      begin: {
        type: String,
      },
      end: {
        type: String,
      },
    },

    stage: {
      type: Number,
    },
  });

  timerExecSchema.index({
    timer_type: 1,
    'exec_time.end': -1,
  });
  return mongoose.model('timer_exec', timerExecSchema);
};
