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
      
                 // ボタンにイベントを設定
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
                { iconCls: 'action', id: 'speak', text: 'SP'},
                { iconCls: 'add' },
                { iconCls: 'arrow_down' },
                { iconCls: 'arrow_left' },
                { iconCls: 'compose' },
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
  var json = [             {text: events.say, value: events.say},
                           {text: events.saw, value: events.saw},
                           {text: events.pan, value: events.pan},
                           {text: events.move, value: events.move},
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
    //選択したボタンの描画
    eventPanel.add({
    xtype: 'button',
    id: eventId,
    text: value.action,//選択した値のボタンを生成
    height: '44px',
    ui: 'action',
    margin: 5,
    // ボタンにイベントを設定
    handler: function() {
      eventBtnTapped(this.id);
    }});

    //Add Buttonの再描画
    obj.parent.add(
      createEventAddBtn()
    );

    //イベントトリガーのaddBtnの削除
    obj.parent.remove(addBtn);

    //Action add buttonの生成
    mainPanel.add(createActionPanel()); 
    //actionPanel.add(createActionPlusBtn());
   
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
var actionBtnTapped = function(obj){

  //Action Mode
  switch (obj.id){
    case "speak":
      //alert(obj.id);
      //Add ActionItem
      currentActionPanel.add(addActionBtn(obj.id));
      actionFloatPanel.hide();
      break;

    default:
      alert(obj.id + "は、今使えません。");
      break;
  }
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
