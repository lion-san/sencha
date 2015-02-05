var addBtn;

var naviView;
var mainPanel;
var actionFloatPanel;

var eventPanel;
var currentActionPanel;
var actionPanels = new Array();//イベント毎のアクションスタック
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
                 //badgeText: '2',
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
              iconMask: true
              ,handler: function() {
	        actionBtnTapped(this);
	      }
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

  
  //既存のものがあれば消す
  if(eventCount > 0)
    currentActionPanel.hide();

    //イベント処理追加数のカウントアップ
    eventCount = eventCount + 1;

    var eventId = 'event' + eventCount;

  //イベントの条件入力へ
  //Action Mode
  switch (value.action){
    case "say":
      naviView.push(eventSaid(eventId, events.say));
      break;

    default:
      eventCount = eventCount - 1;
      alert(obj.id + "は、今使えません。");
      break;
  }

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
          if(input1 == "==")
            input1 = "完全";
          else
            input1 = "部分";
         

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
var createEventBtn = function(eventId, btnName){
  var btn = Ext.create('Ext.Button', {
    id: eventId,
    text: btnName,//選択した値のボタンを生成
    height: '44px',
    ui: 'action',
    margin: 5,
    // ボタンにイベントを設定
    handler: function() {
      eventBtnTapped(this.id);
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
  currentActionPanel = actionPanels[num - 1];
  currentActionPanel.show();

}


/**
 * actionBtnTapped
 */
var actionStack = new Array();
var actionBtnTapped = function(obj){

  //Action Stackに追加


  //Action Mode
  switch (obj.id){
    case "talk":
      //alert(obj.id);
      //Add ActionItem
      naviView.push(programingTalk(obj.id));
      actionFloatPanel.hide();
      break;

    case "light":
      addActionBtn("光る");
      actionFloatPanel.hide();
      break;

    case "camera":
      addActionBtn("写真を撮る");
      actionFloatPanel.hide();
      break;

    case "wait":
      naviView.push(programingWait(obj.id));
      actionFloatPanel.hide();
      break;

    default:
      alert(obj.id + "は、今使えません。");
      break;
  }
}
//sub function
var programingTalk = function(id){
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
            //ボタンを生成して、戻る
            currentActionPanel.add(addActionBtn("話す [" + input + "]"));
            naviView.pop();
          }
        }
      }
    ]
  });

  return panel;
}

//sub function
var programingWait = function(id){
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
          var input = obj.getValue();

          //ボタンを生成して、戻る
          if(nullCheck(input, "待ち時間を入力してね")){
            currentActionPanel.add(addActionBtn("[" + input + "] 秒待つ"));
            naviView.pop();
          }
        }
      }
    ]
  });

  return panel;
}



/**
 * 選択したアクションボタンの描画
 */
var addActionBtn = function(id){

  var newBtn = Ext.create('Ext.Button', {
    text: id 
  });

  currentActionPanel.add(newBtn);
  actionFloatPanel.hide();

  return newBtn;
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
    alert(msg);
    return false;
  }
  else
    return true;
}

