### 计划购车
1. 异步调用事件引擎EventEngine，Engine 根据事件类别获取 EventService = serviceTbl[category]
  - 引擎接口 Engine -> process(category, context)
  - category 事件类型，购车、置换、二手车、完善资料、生日等

2. 引擎调用 EventService 接口 getDetailType(context) 获取用户事件任务类型
  - 不同 category 事件类型，需要实现函数 Service -> getDetailType(context)
  - 函数返回定义的事件任务类型常量

3. EventEngine 引擎根据 owner 事件任务拥有者，和 [2](#) 获取事件任务类型，获取事件任务
  - 获取owner所拥有角色 roles 的事件集合
  - 根据事件任务类型，获取事件任务 event_rules

4. 引擎调用 EventService 接口 getEventTask(rule, context) 获取组装好的事件任务
  - 根据参数 context 更新事件规则参数 rule 中需要调整的键值

5. 引擎调用 EventService 接口 getUpdateRelatedEventTask(events, context) 获取当前事件相关联的事件任务

6. 引擎更新保存 owner 需要生成的事件任务 和 相关的事件任务

### 数据结构

```
// role.event_rules:
{
  "category": "buy_car_plan",
  "rules":[
    {
      "event_type": "",
      "task_type": "buy_car_plan_week",
      "content": "请邀请客户#{cust}到东城天道店看车购车"   // ????前后端配合：客户姓名，能够查看详情。
      "pre_cycle": {
        cate: 'hour',
        value: 2
      },
      "trigger": {
        "rule": "now", // now 立刻, cycle周期, delay 推迟
        "cycle": { // 空时，不产生周期任务
          cate: day,
          value: 10,
        },
        "start": "", // 生成事件任务的时间，时分秒
        "end": {
          "cate":"hour",
          value:24
        }
      },

      "reminder": {
        "rule_key": 2
        "rule_name": "截前半小时", 
        "time_diff": 1800, 
      },
    }
  ],
}

// event_tasks:
{
  "category": "car_plan_one_week",
  "related": { 
    "id": "计划购车--id", 
    "func_model": "buy_car_plan", 
  }
  "executor": [
    {
      "id": "",
      "name": "",
      "from": "",
    }
  ],
  "status": "" , // 当前 户规则状态
  "context": {cust,car_plan_id}, // 上下 相关
  "rules":{
    "task_type": "cust_to_shop_buycar", 
    "content": "请邀请客户#{cust}到东城天道店看车购车",    // ????前后端配合：客户姓名，能够查看详情。
    "extend": {}, // 任务扩展
    
    "trigger": {
      "rule": "now", // now, cycle, delay
      "cycle": null,
      "start": "", // 生成事件任务的时间，时分秒
      "end": {
        "cate": "hour"
        "value": 24,
      }
      "end_time": "", // 任务结束时间 HH:mm:SS 设置固结束定值, 默认为空
    }
    "reminder": {
      "rule_key": 2
      "rule_name": "截前半小时", 
      "time_diff": 1800, 
    },
  },
  create_time: "",
  update_time: "",
  last_cycle_time: "",// 上次周期触发生成任务时间, 如果角色事件规则设置了pre_cycle，计算上次的周期任务触发时间
}

```