

# 系统任务

1、功能来源
2、事件服务，生成事件：    EventService--》生成事件接口（func_category，context）
3、事件匹配到任务规则：      
输入：event_category
逻辑：基于event_category，查找所有roles的events_rules的rule。合并为1维数组。
返回：task_rules
4、任务规则--》创建任务
  

## A1.1任务       购车计划

1、功能来源：计划购车                   王宇

2、生成事件服务                    史子超
输入：func_category === 'car_plan'         context(cust，car_plan_id)
逻辑：基于（cust，car_plan_id）     计划购车时间 === 一周内
返回：event_category = 'car_plan_buy_one_week'    

4、任务规则--》创建任务
找到执行人       客户所属的Bee
"shop_id": "",          //??从哪取,,,不要了？
"related":{
    entity:"car_plan",
    id:"car_plan_id",
}
"content": "请邀请客户#{cust}到#{shop.name}看车购车",    //????前后端配合：客户姓名，能够查看详情。
//#{shop.name}，在那个环节处理

```
// role.event_rules:
{
    "event_category": "car_plan_buy_one_week",
    "rules":[
    {
        "task_category": "task_cust_to_shop_buycar", 
        "content": "请邀请客户#{cust}到${shop.name}看车购车",
        "trigger": {
            "rule": "now" , // day, week, month ,now马上,later延迟
            "end":{
                "delay_hour":"24",
            }
        },
        "reminder": {
            "rule_key": 3
            "rule_name": "截前3小时", 
            "time_diff": 3*60*60, 
        },
    }
    ],
}


// event_tasks:
{
    "event_category": "car_plan_buy_one_week",
    "shop_id": "",
    "related": { 
        "id": "car_plan_id", 
        "entity": "car_plan", 
    }
    "executor": [
    {
        "id":'',
        "name": "",
        "from": "",
    }
    ],
    "status": "" , // 当前 户规则状态    
    "context": {cust,car_plan_id}, // 上下 相关    
    "rules":[
    {
        "task_category": "task_cust_to_shop_buycar", 
        "content": "请邀请客户#{cust}到${shop.name}看车购车",
        "trigger": {
            "rule": "now" , // day, week, month ,now马上,later延迟
            "end":{
                "delay_hour":"24",
            }
        },
        "reminder": {
            "rule_key": 3
            "rule_name": "截前3小时", 
            "time_diff": 3*60*60, 
        },
    }
    ],
}

```



## A1.2任务   邀约任务

1、功能来源：邀约任务                   生喜
task_cust_to_shop_buycar，执行，都选中了。

2、生成事件服务                    史子超
输入：func_category === 'task_cust_to_shop_buycar'         context(task)
返回：event_category = 'cust_to_shop_buycar'    

4、任务规则--》创建任务
找到执行人       task中选中的人。
"shop_id": "",   
"related":{
    entity:"task",
    id:"task._id",
}
"content": "${bee.name}的客户#{cust}要进店看车、购车，请提前和客户预约时间，做好接待准备。",   


```
// role.event_rules:
{
    "event_category": "cust_to_shop_buycar",
    "rules":[
    {
        "task_category": "task_cust_to_shop_buyservice", 
        "content": "${bee.name}的客户#{cust}要进店看车、购车，请提前和客户预约时间，做好接待准备。",
        "trigger": {
            "rule": "now" , // day, week, month ,now马上,later延迟
            "end":{
                "delay_hour":"24",
            }
        },
        "reminder": {
            "rule_key": 3
            "rule_name": "截前3小时", 
            "time_diff": 3 * 60 * 60, 
        },
    }
    ],
}


// event_tasks:
{
    "event_category": "cust_to_shop_buycar",
    "shop_id": "",          
    "related": { 
        "id": task._id, 
        "entity": "task", 
    }
    "executor": [
    {
        "id":'',
        "name": "",
        "from": "",
    }
    ],
    "status": "" , // 当前 户规则状态    
    "context": {task}, // 上下 相关    
    "rules":[
    {
        "task_category": "task_cust_to_shop_buyservice", 
        "content": "${bee.name}的客户#{cust}要进店看车、购车，请提前和客户预约时间，做好接待准备。",
        "trigger": {
            "rule": "now" , // day, week, month ,now马上,later延迟
            "end":{
                "delay_hour":"24",
            }
        },
        "reminder": {
            "rule_key": 3
            "rule_name": "截前3小时", 
            "time_diff": 3 * 60 * 60, 
        },
    }
    ],
}

```


## A2.1任务       购车计划

1、功能来源：计划购车                   王宇

2、生成事件服务                    史子超
输入：func_category === 'car_plan'         context(cust，car_plan_id)
逻辑：基于（cust，car_plan_id）     计划购车时间 === 一月内/半年/一年内/一年后
返回：event_category = 'car_plan_buy_one_month'    /car_plan_buy_half_year/car_plan_buy_one_year/car_plan_buy_one_year_later

4、任务规则--》创建任务
找到执行人       客户所属的Bee
"shop_id": "",  
"related":{
    entity:"car_plan",
    id:"car_plan_id",
}
"content": "请和客户#{cust}聊聊购车计划，有没有新的目标、新的变化？",
立刻创建吗？还是延迟10天后？
trigger，是否需要处理时间？


不同的event_category，role.event_rules:的rule都单独配置，除trigger，其他同。
car_plan_buy_half_year
        "trigger": {
            "rule": "day" ,
            "cycle": 36,
            "start": "now",
            "end":{
                "delay_hour":"24",
            }
        },
car_plan_buy_one_year
        "trigger": {
            "rule": "day" ,
            "cycle": 60,
            "start": "now",
            "end":{
                "delay_hour":"24",
            }
        },
car_plan_buy_one_year_later
        "trigger": {
            "rule": "day" ,
            "cycle": 90,
            "start": "now",
            "end":{
                "delay_hour":"24",
            }
        },


```
// role.event_rules:
{
    "event_category": "car_plan_buy_one_month",
    "rules":[
    {
        "task_category": "task_ask_cust_carplan_buy", 
        "content": "请和客户#{cust}聊聊购车计划，有没有新的目标、新的变化？",
        "trigger": {
            "rule": "day" ,
            "cycle": 10,
            "start": "now",
            "end":{
                "delay_hour":"24",
            }
        },
        "reminder": {
            "rule_key": 3
            "rule_name": "截前3小时", 
            "time_diff": 3*60*60, 
        },
    }
    ],
}

// event_tasks:
{
    "event_category": "car_plan_buy_one_month",
    "shop_id": "",
    "related": { 
        "id": "car_plan_id", 
        "entity": "car_plan", 
    }
    "executor": [
    {
        "id":'',
        "name": "",
        "from": "",
    }
    ],
    "status": "" , // 当前 户规则状态    
    "context": {cust,car_plan_id}, // 上下 相关    
    "rules":[
    {
        "task_category": "task_ask_cust_carplan_buy", 
        "content": "请和客户#{cust}聊聊购车计划，有没有新的目标、新的变化？",
        "trigger": {
            "rule": "day" ,
            "cycle": 10,
            "start": "now",
            "end":{
                "delay_hour":"24",
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

```





## B1.1任务       购车计划

2、生成事件服务                    史子超
输入：func_category === 'car_plan'         context(cust，car_plan_id)
逻辑：基于（cust，car_plan_id）     计划购车时间 === 一周内  && “已有车辆”中已选择了计划出手时间 一周内
返回：event_category = 'car_plan_replace_one_week'    

4、任务规则--》创建任务
找到执行人       客户所属的Bee
"shop_id": "",         
"related":{
    entity:"car_plan",
    id:"car_plan_id",
}
"content": "请邀请客户#{cust}到${shop.name}评估、置换${sell_car.cartype},${sell_car.carmodel}并为其选择一位销售专家。",   

```
// role.event_rules:
{
    "event_category": "car_plan_replace_one_week",
    "rules":[
    {
        "task_category": "task_cust_to_shop_replacecar", 
        "content": "请邀请客户#{cust}到${shop.name}评估、置换${sell_car.cartype},${sell_car.carmodel}并为其选择一位销售专家。",  
        "trigger": {
            "rule": "now" , // day, week, month ,now马上,later延迟
            "end":{
                "delay_hour":"24",
            }
        },
        "reminder": {
            "rule_key": 3
            "rule_name": "截前3小时", 
            "time_diff": 3*60*60, 
        },
    }
    ],
}


// event_tasks:
{
    "event_category": "car_plan_replace_one_week",
    "shop_id": "",
    "related": { 
        "id": "car_plan_id", 
        "entity": "car_plan", 
    }
    "executor": [
    {
        "id":'',
        "name": "",
        "from": "",
    }
    ],
    "status": "" , // 当前 户规则状态    
    "context": {cust,car_plan_id}, // 上下 相关    
    "rules":[
    {
        "task_category": "task_cust_to_shop_replacecar", 
        "content": "请邀请客户#{cust}到${shop.name}评估、置换${sell_car.cartype},${sell_car.carmodel}并为其选择一位销售专家。", 
        "trigger": {
            "rule": "now" , // day, week, month ,now马上,later延迟
            "end":{
                "delay_hour":"24",
            }
        },
        "reminder": {
            "rule_key": 3
            "rule_name": "截前3小时", 
            "time_diff": 3*60*60, 
        },
    }
    ],
}

```


## B1.2任务   邀约任务产生

1、功能来源：邀约任务                   生喜
task_cust_to_shop_replacecar，执行，都选中了。

2、生成事件服务                    史子超
输入：func_category === 'task_cust_to_shop_replacecar'         context(task)
返回：event_category = 'cust_to_shop_replacecar'    

4、任务规则--》创建任务
找到执行人       task中选中的人。
"shop_id": "",   
"related":{
    entity:"task",
    id:"task._id",
}
"content": "${bee.name}的客户#{cust}要进店评估、置换${sell_car.cartype},${sell_car.carmodel}，请提前和客户预约时间，做好接待准备。",


```
// role.event_rules:
{
    "event_category": "cust_to_shop_replacecar",
    "rules":[
    {
        "task_category": "task_cust_to_shop_replaceservice", 
        "content": "${bee.name}的客户#{cust}要进店评估、置换${sell_car.cartype},${sell_car.carmodel}，请提前和客户预约时间，做好接待准备。",
        "trigger": {
            "rule": "now" , // day, week, month ,now马上,later延迟
            "end":{
                "delay_hour":"24",
            }
        },
        "reminder": {
            "rule_key": 3
            "rule_name": "截前3小时", 
            "time_diff": 3 * 60 * 60, 
        },
    }
    ],
}


// event_tasks:
{
    "event_category": "cust_to_shop_buycar",
    "shop_id": "",          
    "related": { 
        "id": task._id, 
        "entity": "task", 
    }
    "executor": [
    {
        "id":'',
        "name": "",
        "from": "",
    }
    ],
    "status": "" , // 当前 户规则状态    
    "context": {task}, // 上下 相关    
    "rules":[
    {
        "task_category": "task_cust_to_shop_replaceservice", 
        "content": "${bee.name}的客户#{cust}要进店评估、置换${sell_car.cartype},${sell_car.carmodel}，请提前和客户预约时间，做好接待准备。",
        "trigger": {
            "rule": "now" , // day, week, month ,now马上,later延迟
            "end":{
                "delay_hour":"24",
            }
        },
        "reminder": {
            "rule_key": 3
            "rule_name": "截前3小时", 
            "time_diff": 3 * 60 * 60, 
        },
    }
    ],
}

```


## B2.1任务 

2、生成事件服务                    史子超
输入：func_category === 'car_plan'         context(cust，car_plan_id)
逻辑：基于（cust，car_plan_id）     计划购车时间 === 一月内/半年/一年内/一年后
&& 已有车辆，出手==一月内/半年/一年内/一年后
返回：event_category = 'car_plan_replace_one_month'    /car_plan_replace_half_year/car_plan_replace_one_year/car_plan_replace_one_year_later

4、任务规则--》创建任务
找到执行人       客户所属的Bee
"shop_id": "",  
"related":{
    entity:"car_plan",
    id:"car_plan_id",
}
"content": "请和客户#{cust}聊聊${sell_car.cartype},${sell_car.carmodel}的置换计划，有没有新的目标、新的变化？",
立刻创建吗？还是延迟10天后？
trigger，是否需要处理时间？


不同的event_category，role.event_rules:的rule都单独配置，除trigger，其他同。
car_plan_replace_half_year
        "trigger": {
            "rule": "day" ,
            "cycle": 36,
            "start": "now",
            "end":{
                "delay_hour":"24",
            }
        },
car_plan_replace_one_year
        "trigger": {
            "rule": "day" ,
            "cycle": 60,
            "start": "now",
            "end":{
                "delay_hour":"24",
            }
        },
car_plan_replace_one_year_later
        "trigger": {
            "rule": "day" ,
            "cycle": 90,
            "start": "now",
            "end":{
                "delay_hour":"24",
            }
        },


```
// role.event_rules:
{
    "event_category": "car_plan_replace_one_month",
    "rules":[
    {
        "task_category": "task_ask_cust_carplan_replace", 
        "content": "请和客户#{cust}聊聊${sell_car.cartype},${sell_car.carmodel}的置换计划，有没有新的目标、新的变化？",
        "trigger": {
            "rule": "day" ,
            "cycle": 10,
            "start": "now",
            "end":{
                "delay_hour":"24",
            }
        },
        "reminder": {
            "rule_key": 3
            "rule_name": "截前3小时", 
            "time_diff": 3*60*60, 
        },
    }
    ],
}

// event_tasks:
{
    "event_category": "car_plan_replace_one_month",
    "shop_id": "",
    "related": { 
        "id": "car_plan_id", 
        "entity": "car_plan", 
    }
    "executor": [
    {
        "id":'',
        "name": "",
        "from": "",
    }
    ],
    "status": "" , // 当前 户规则状态    
    "context": {cust,car_plan_id}, // 上下 相关    
    "rules":[
    {
        "task_category": "task_ask_cust_carplan_replace", 
        "content": "请和客户#{cust}聊聊${sell_car.cartype},${sell_car.carmodel}的置换计划，有没有新的目标、新的变化？",
        "trigger": {
            "rule": "day" ,
            "cycle": 10,
            "start": "now",
            "end":{
                "delay_hour":"24",
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

```
 