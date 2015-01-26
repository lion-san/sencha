var addBtn;

//Action追加ボタン「＋」
var addActionBtn = Ext.create('Ext.Button', {
      iconCls: 'add',
      iconMask: true,
      height: '66px'
  /*actionFloatPanel = Ext.create('Ext.Panel', {
    html: 'Float',
    left: 0,
    padding: 10
  });//.showBy(addActionBtn);*/
});

var hoge = function(){
  alert("hoge");
}
addActionBtn.on('tap', hoge, this);
var hoge2 = addActionBtn.getListeners();

//ActionPanel
var actionPanel = Ext.create('Ext.Panel', {
  layout: 'vbox',
  height: '70%',
  scrollable: true,
  items: [
  {
    html: 'Action',
    //height: '100%',
    style: 'background-color: #5E99CC;'
  }
  ]
});


//ActionFloatPanel
var actionFloatPanel;/* = Ext.create('Ext.Panel', {
  html: 'Float',
  left: 0,
  padding: 10
}).showBy(addActionBtn);
*/

//Main
Ext.application({
  launch: function() {
    Ext.Viewport.add({
      xtype: 'navigationview',
        items: 
          [
          {
            xtype: 'panel',
            title: 'Program mode',    // ナビゲーションバーに表示する文字列
            items : [//start item
            {
              xtype: 'label',
              html: 'Event'
            },
            {//Upper
              xtype: 'panel',
              layout: 'hbox',
              height: '30%',
              scrollable: true,
            　items: [
              {
            　   xtype: 'button',
                 text: 'Add',
                 iconCls: 'add',
                 iconMask: true,
                 //badgeText: '2',
                 height: '44px',
                 ui: 'round',
      
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
                           //alert(value);
                           add_tapped(obj, value);
                         }
                       }
                     });
                   }
                   this.picker.show();
                 }
              }
             ]
            },
            //下段のレイアウト
            actionPanel
          ]//end item
          }]//navigationview item
    });//Ext.Viewport
  }
});

//Functions
var add_tapped = function(obj, value){
    //alert("hoge");
    //選択したボタンの描画
    obj.parent.add({
    xtype: 'button',
    text: value.action,//選択した値のボタンを生成
    height: '44px',
    ui: 'action',
    // ボタンにイベントを設定
    handler: function() {
      add_tapped(obj);
    }});

    //Add Buttonの再描画
    obj.parent.add({
             　   xtype: 'button',
                 text: 'Add',
                 iconCls: 'add',
                 iconMask: true,
                 //badgeText: '2',
                 height: '44px',
                 ui: 'round',
      
                 // ボタンにイベントを設定
                 handler: function() {
                   //add_tapped(this); 
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
                           add_tapped(obj, value);
                         }
                       }
                     });
                   }
                   this.picker.show();
                 }
    });

    //イベントトリガーのaddBtnの削除
    obj.parent.remove(addBtn);

    //ActionBtnの生成
/*      addAction = Ext.create('Ext.Button', {
      iconCls: 'add',
      iconMask: true,
      height: '66px'
      });*/
    actionPanel.add(addActionBtn);

  actionFloatPanel = Ext.create('Ext.Panel', {
    html: 'Float',
    left: 0,
    padding: 10
  });//.showBy(addActionBtn);
}

//actionBtn
var createActionBtn = function(){
}

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
