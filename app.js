var addBtn;

var naviView;
var mainPanel;
var actionFloatPanel;

var eventPanel;
var currentActionPanel;
var actionPanels = new Array();//イベント毎のアクションスタック
var allEvents = new Array();//全イベントJSONリスト
var actions = new Array();//全アクションJSONリスト
var currentActions = new Array();//アクション用JSON
var eventCount = 0;


//-------------------------------------
//Main layout
//-------------------------------------
Ext.application({
  launch: function() {
   
    Ext.Viewport.add({
      xtype: 'navigationview',
      id: 'naviView',
        items: 
          [
          {
            xtype: 'panel',
            id: 'mainPanel',
            title: 'Program mode',    // ナビゲーションバーに表示する文字列
            items : [//start item
            {
              xtype: 'label',
              html: 'Event'
            },
            {//Upper
              xtype: 'panel',
              id: 'eventPanel',
              layout: 'hbox',
              height: '30%',
              scrollable: true,
            },
            {//Toobar
              xtype: 'toolbar',
              docked: 'top',
              items: [
                {
                  text: 'Save',
                  align: 'left',
                  handler: function(){
                    saveProject();
                  }
                },
                {
                  iconCls: 'home',
                  iconMask: true,
                  align: 'right'
                },
                {
                  iconCls: 'refresh',
                  iconMask: true,
                  align: 'right',
                  handler: function(){
                    loadProject();
                  }
                }
              ]
          }
          ]//end item
          }]//navigationview item
    });//Ext.Viewport


  //--------------------------------
  //EventAddButtonの生成
  var panels  = Ext.ComponentQuery.query('panel');
  eventPanel = getObjectById(panels, 'eventPanel');
  eventPanel.add(createEventAddBtn());
  
  //インスタンスの取得
  var navis  = Ext.ComponentQuery.query('navigationview');
  naviView = getObjectById(navis, 'naviView');

  mainPanel = getObjectById(panels, 'mainPanel');
  actionPanel = getObjectById(panels, 'actionPanel');

  //ActionFloatPanelの生成
  createActionFloatPanel();
  Ext.Viewport.add(actionFloatPanel);

  //--------------------------------
  }
});


//-------------------------------------------------------
//Functions
//-------------------------------------------------------

//--- create start ----------------------------------------------
/**
 * EventAddBtnの生成
 */
var createEventAddBtn = function(){
  var btn = Ext.create('Ext.Button', {
                 text: 'Add',
                 iconCls: 'add',
                 iconMask: true,
                 badgeText: 'v3',
                 height: '44px',
                 ui: 'round',
                 margin: 5,
      
                 // ボタンにイベントをtextfield設定
                 handler: function() {
                   var obj = this;
                   addBtn = this;
                   if( !this.picker) {
                     this.picker = Ext.Viewport.add({
                       xtype: 'picker',
                       slots: {
                         name: 'action',
                         title: 'Function',
                         data: makeList()
                       },
                       listeners : {
                         change : function (picker, value) {
                           eventAddBtnTapped(obj, value);
                         }
                       }
                     });
                   }
                   this.picker.show();
                 }
  });

  return btn;
 
}

/**
 * ActionFloatPanelの生成
 */
var createActionFloatPanel = function(){
   //Floating panel
   actionFloatPanel = Ext.create('Ext.Panel', {
        centered: true,
        width: '100%',
        hidden: true,
        items: [
        {//--------------------------
            defaults: {
              xtype: 'button',
              margin: 5,
              width: '44px',
              height: '44px',
              iconMask: true,
              handler: function() {
	        actionBtnTapped(this);
	      },
              listeners: {taphold:function(){Ext.Msg.alert("hoge");}}
            },
            layout: 'hbox',
            items: [ 
                { iconCls: 'info', id: 'talk', text: 'SP'},
                { iconCls: 'star', id: 'light'},
                { iconCls: 'user', id: 'camera'},
                { iconCls: 'time', id: 'wait'},
                { iconCls: 'search' },
                { iconCls: 'locate' },
           ] 
        },//--------------------------
       {//Cancel button
            xtype: 'toolbar',
            docked: 'top',
            defaults: {
                iconMask: true
            },
            items: [
                { xtype: 'spacer' },
                { iconCls: 'delete', left: '85%', handler: function() {actionFloatPanel.hide()} },
                { xtype: 'spacer' }
            ]
       }]});
   return actionFloatPanel;
}


/**
 * createActionPanel
 */
var createActionPanel = function(){

  var id = 'actionPanel' + eventCount;

  var panel = Ext.create('Ext.Panel', {
    id: id,
    layout: 'vbox',
    height: '70%',
    scrollable: true,
    items: [
      {
        html: 'Action',
        style: 'background-color: #5E99CC;'
      }
    ]
  });

  actionPanels.push(panel);//スタックにプッシュ
  currentActionPanel = panel;

  //+ボタンの追加
  panel.add(createActionPlusBtn());
  return panel;
}

//Action追加ボタン「＋」
var createActionPlusBtn = function() {

  var id = 'plus' + eventCount;

  var plus = Ext.create('Ext.Button', {
      id: id,
      iconCls: 'add',
      iconMask: true,
      height: '66px',
      handler: function() {
      //ActionFloatPanelの表示
       actionFloatPanel.show(); 
     }});
  return plus;
}


/**
 * makeList
 * Pickers lists
 */
var makeList = function(){
  var json = [             {text: events.say, value: 'say'},
                           {text: events.saw, value: 'saw'},
                           {text: events.pan, value: 'pan'},
                           {text: events.move, value: 'move'},
                           {text: '', value: 'null'}];
  return json;
}


//Valueとイベントのマップ
var events = { 
  "say": "音声を検知",
  "saw": "誰かを見たら",
  "pan": "手をたたく",
  "move": "動作を検知"
};

//--- create end ----------------------------------------------


//--- event start ----------------------------------------------

/**
 * eventAddBtnTapped
 */
var eventAddBtnTapped = function(obj, value){

  //currentActionsの設定
  currentActions = new Array();
  actions.push( currentActions );
  
  //既存のものがあれば消す
  if(eventCount > 0)
    currentActionPanel.hide();

    var eventId = 'event' + eventCount;

  //イベントの条件入力へ
  //Action Mode
  switch (value.action){
    case "say":
      naviView.push(eventSaid(eventId, events.say));
      break;

    default:
      Ext.Msg.alert(obj.id + "は、今使えません。");
      return;
      //break;
  }

    //イベント処理追加数のカウントアップ
    eventCount = eventCount + 1;
}

//Sub Function
var eventSaid = function(eventId, btnName){
  var panel = Ext.create('Ext.Panel', {
    title: 'What human say?',
    items: [
      {xtype: 'label', html: '一致条件を選択してね'},
      {xtype: 'selectfield', name: 'options', id: 'ifsay',
        options: [
          {text: '部分一致したら', value: '='},
          {text: '完全一致したら', value: '=='}
        ]
      },
      {xtype: 'label', html: '条件を入力してね'},
      {xtype: 'textfield', id:'whatsay'},
      {xtype: 'button', text: '登録', ui: 'action',
        handler: function() {//登録ボタンを押したら
          //入力値の取得
          var objs  = Ext.ComponentQuery.query('textfield');
          var obj = getObjectById(objs, 'whatsay');
          var input2 = obj.getValue();

          objs  = Ext.ComponentQuery.query('selectfield');
          obj = getObjectById(objs, 'ifsay');
          var input1 = obj.getValue();
          if(input1 == "=="){
            input1 = "完全";

            //JSONのPush
            var json = {"event": "say", "type" : "=="};
            allEvents.push( json );
          }
          else{
            input1 = "部分";
            var json = {"event": "say", "type" : "="};
            allEvents.push( json );
          }
         

          if(nullCheck(input2, "条件を入力してね")){
            //選択したボタンの描画
            eventPanel.add(createEventBtn(eventId, btnName + "["+ input1 + ":" + input2 +"]"));
            removeAndCreateEventAddBtn();
            naviView.pop();
          }
        }
      }
    ]
  });

  return panel;
}

//Sub Function
//イベント（条件）ボタンの生成
var createEventBtn = function(eventId, btnName){
  var btn = Ext.create('Ext.Button', {
    id: eventId,
    text: btnName,//選択した値のボタンを生成
    height: '44px',
    ui: 'action',
    margin: 5,
    // ボタンにイベントを設定
    handler: function() {
      //カレントアクション配列の付け替え
      currentActions = actions[Number(getEventId(this.id))]; 
      eventBtnTapped(this.id);
    },
    listeners : {
      element: 'element',
      taphold: function(e){
        //For Delete
        var actionSheet = deleteConfirm( this, "event" ); 
        Ext.Viewport.add( actionSheet );
        actionSheet.show();
      }
    }
  });

  return btn;
}

//Sub Function
var removeAndCreateEventAddBtn = function(){

    //Add Buttonの再描画
    eventPanel.add(
      createEventAddBtn()
    );

    //イベントトリガーのaddBtnの削除
    eventPanel.remove(addBtn);

    //Action add buttonの生成
    mainPanel.add(createActionPanel()); 
}

/**
 * eventBtnTapped
 */
var eventBtnTapped = function(actionPanelId){

  currentActionPanel.hide();
  var num = Number(getEventId(actionPanelId));
  currentActionPanel = actionPanels[num];
  currentActionPanel.show();

}


/**
 * actionBtnTapped
 */
var actionBtnTapped = function(obj, json){

  var currentAction;

  //Action Mode
  switch (obj.id){
    case "talk":
      //Add ActionItem
      currentAction = programingTalk( json );
      naviView.push( currentAction );
      actionFloatPanel.hide();
      break;

    case "light":
      programingLight();
      actionFloatPanel.hide();
      break;

    case "camera":
      programingCamera();
      actionFloatPanel.hide();
      break;

    case "wait":
      currentAction = programingWait( json );
      naviView.push( currentAction );
      actionFloatPanel.hide();
      break;

    default:
      Ext.Msg.alert(obj.id + "は、今使えません。");
      return;
      //break;
  }
 
}

//sub function
var programingTalk = function( json ){

  //修正の場合
  if( json != null){
  var panel = Ext.create('Ext.Panel', {
    title: 'I can talk',
    items: [
      {xtype: 'label', html: 'ここにメッセージを入力してね。'},
      {xtype: 'textfield', id:'talktext', value: json.param },
      {xtype: 'button', text: '登録', ui: 'action',
        handler: function() {//登録ボタンを押したら
          //入力値の取得
          var objs  = Ext.ComponentQuery.query('textfield');
          var obj = getObjectById(objs, 'talktext');
          var input = obj.getValue();

          if(nullCheck(input, "メッセージを入力してね")){

          objs  = Ext.ComponentQuery.query('button');
          obj = getObjectById(objs, json.id);
          obj.setText("話す [" + input + "]");
            
            //Jsonを更新
            json.param = input;

            //戻る
            naviView.pop();
 
          }
        }
      }
    ]
  });
  return panel;
  }

  var panel = Ext.create('Ext.Panel', {
    title: 'I can talk',
    items: [
      {xtype: 'label', html: 'ここにメッセージを入力してね。'},
      {xtype: 'textfield', id:'talktext'},
      {xtype: 'button', text: '登録', ui: 'action',
        handler: function() {//登録ボタンを押したら
          //入力値の取得
          var objs  = Ext.ComponentQuery.query('textfield');
          var obj = getObjectById(objs, 'talktext');
          var input = obj.getValue();

          if(nullCheck(input, "メッセージを入力してね")){

            var btn = addActionBtn("話す [" + input + "]");

            //Jsonに出力
            addActionJson(btn.id, "talk", input, true);

            //ボタンを生成して、戻る
            currentActionPanel.add( btn );
            naviView.pop();
          }
        }
      }
    ]
  });

  return panel;
}

//sub function
var programingWait = function( json ){

  //修正の場合
  if( json != null){

    //Navi画面の生成
  var panel = Ext.create('Ext.Panel', {
    title: 'I am waiting ',
    items: [
      {xtype: 'label', html: '何秒待てばいい？'},
      {xtype: 'textfield', id:'waittime', value: json.param },
      {xtype: 'button', text: '登録', ui: 'action',
        handler: function() {//登録ボタンを押したら
          //入力値の取得
          var objs  = Ext.ComponentQuery.query('textfield');
          var obj = getObjectById(objs, 'waittime');
          var input = toHankaku( obj.getValue() );

          objs  = Ext.ComponentQuery.query('button');
          obj = getObjectById(objs, json.id);
          
          //ボタンを生成して、戻る
          if(nullCheck(input, "待ち時間を入力してね")){
            if(numberCheck(input, "数字を入力してね")){

            obj.setText("[" + input + "] 秒待つ");
            
            //Jsonを更新
            json.param = input;

            //戻る
            naviView.pop();
          }}
        }
      }
    ]
  });programingWait
  return panel;
  }

  var panel = Ext.create('Ext.Panel', {
    title: 'I am waiting ',
    items: [
      {xtype: 'label', html: '何秒待てばいい？'},
      {xtype: 'textfield', id:'waittime'},
      {xtype: 'button', text: '登録', ui: 'action',
        handler: function() {//登録ボタンを押したら
          //入力値の取得
          var objs  = Ext.ComponentQuery.query('textfield');
          var obj = getObjectById(objs, 'waittime');
          var input = toHankaku( obj.getValue() );

          //ボタンを生成して、戻る
          if(nullCheck(input, "待ち時間を入力してね")){
            if(numberCheck(input, "数字を入力してね")){
            var btn  = addActionBtn("[" + input + "] 秒待つ");
            
            //Jsonに出力
            addActionJson(btn.id, "wait", input, true);

            currentActionPanel.add( btn );
            naviView.pop();
          }}
        }
      }
    ]
  });

  return panel;
}

//sub function
var programingCamera = function(){

    var btn = addActionBtn("写真を撮る");

    //Jsonに出力
    addActionJson(btn.id, "camera", null, false);
}

//sub function
var programingLight = function(){

    var btn = addActionBtn("光る");

    //Jsonに出力
    addActionJson(btn.id, "light", null, false);
}

/**
 * 選択したアクションボタンの描画
 */
var addActionBtn = function(text){

  var newBtn = Ext.create('Ext.Button', {
    text: text,
    handler: function(){
      //JSONの検索
      var json = getJsonById( this.id ); 

      //編集可能ボタンのみ、ナビ表示
      if(json.modify){

        //Navi画面への遷移
        //ダミーオブジェクト
        var obj = {"id": null};
        obj.id = json.action;
        actionBtnTapped(obj, json);
      }
    },
    listeners : {
      element: 'element',
      taphold: function(e){
        //For Delete
        var actionSheet = deleteConfirm( this, "action" ); 
        Ext.Viewport.add( actionSheet );
        actionSheet.show();
      }
    }

  });

  currentActionPanel.add(newBtn);
  actionFloatPanel.hide();

  return newBtn;
}

//ActionSheet for DELETE
var deleteConfirm = function( btn, btnType ){

  var actionSheet = Ext.create('Ext.ActionSheet', {
    items: [
      {
        text: 'Delete', ui: 'decline',
        handler: function(){
          switch ( btnType ){
            case "action":
              //Delete function
              deleteAction( btn );
            break;

            case "event":
              //Delete event
              deleteEvent( btn );

            default:
            break;
          }

          //Hide actionSheet
          actionSheet.hide();
        }
      },
      {
        text: 'Cancel', ui: 'normal',
        handler: function(){
          actionSheet.hide();
        }
      }
    ]
  });

  return actionSheet;
}

//Delete action
var deleteAction = function ( actionBtn ){

  //Delete from JSON
  deleteJsonById( actionBtn.id );

  //Delete Button
  actionBtn.destroy(); 

}


//Delete event
var deleteEvent = function ( btn ){

  //Delete JSON
  deleteEventJsonById( btn.id );

  //Delete Button
  btn.destroy(); 

  //Delete Panel
  currentActionPanel.destroy();

}

/**
 * saveProject
 * プロジェクトの保存
 */
var saveProject = function(){

  var eventList = new Array();
  var actionList;
  var json;

  var i = 0;
  var j = 0;

  json = "[";

  for (i = 0; i < allEvents.length; i++){
    if(allEvents[i] != null){

      eventList.push( allEvents[i] );
      actionList = new Array();

      json += "{\"event\":\"" + allEvents[i].event + "\",";
      json += "\"operator\":\"" + allEvents[i].type + "\",";

      
      json += "actions: [";
      for(j = 0; j < actions[i].length; j++){
        if(actions[i][j] != null){
          actionList.push( actions[i][j] );

          var param = actions[i][j].param;
          if(param == null)
            param = "";
          
          json += "{\"action\":\"" + actions[i][j].action + "\",";
          json += "\"param\":\"" + param + "\"},\n";

        }
      }

      //Actionsのコンマ削除処理
      json = json.substr(0, json.length-2);
      json += "]";

      json += "},\n";

    }
  }
  //Events最後のコンマ削除処理
  json = json.substr(0, json.length-2);//コンマ+改行コード

  json += "]";

  Ext.Msg.alert("保存しました！");

  return json;
}


/**
 * loadProject
 */
var loadProject = function() {

  var request = new XMLHttpRequest();
  request.open("GET", "localhost:3000/events.json", true);
  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
      //受信完了時の処理
      //var result = document.getElementById("result_get");
      var text = document.createTextNode(decodeURI(request.responseText));
      //result.appendChild(text);
    }
  }
  request.send("");
}

//--- event end ----------------------------------------------

/**
 * getObjectById 
 * Ext.ComponentQuery.query('button'); De Tukau
 */
var getObjectById = function (items, id){
  var i;
  for(i = 0; i < items.length; i++){
    if(items[i].id == id)
	   return items[i];
  }
  return null;
}

/**
 * getEventId
 */
var getEventId = function ( EventId ){
  return EventId.substr(5);

}

/**
 * nullCheck
 */
var nullCheck = function(input, msg){
  if (input.length == 0){
    Ext.Msg.alert(msg);
    return false;
  }
  else
    return true;
}

var numberCheck = function( input, msg ){
  if ( input.match(/[^0-9]+/)){
    Ext.Msg.alert( msg );
    return false;
  }
  else
    return true;
  
}

var toHankaku = function ( input ){
  
  var val =  input.replace( /[０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 65248);
  });

  return val;
}

/**
 * addActionJSON
 */
var addActionJson = function(btnId, action, param, modify){
  var json = {
    "id"     : btnId,
    "action" : action,
    "param"  : param,
    "modify" : modify
  };
  currentActions.push( json );
}

/**
 * getJsonById
 */
var getJsonById = function(id){
  var i;
  for (i = 0; i < currentActions.length; i++){
    if(currentActions[i].id == id)
      return currentActions[i];
  }

  return null;
}

/**
 * deleteJsonById
 */
var deleteEventJsonById = function(id){

  var index = getEventId(id);

  allEvents[index] = null;
  actions[index] = null;

  return null;
}

/**
 * deleteJsonById
 */
var deleteJsonById = function(id){
  var i;
  for (i = 0; i < currentActions.length; i++){
    if(currentActions[i].id == id){
      currentActions.splice( i, 1 );
    }
  }

  return null;
}


