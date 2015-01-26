Ext.application({
  launch: function() {
    Ext.Viewport.add({
      xtype: 'navigationview',
        items: [
          {//panel_1
            xtype: 'panel',
            title: 'Program mode',    // ナビゲーションバーに表示する文字列
            items : [//start item
            {
              xtype: 'label',
              html: 'Program mode'
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
                 /*iconCls: 'add',
                 iconMask: true,
                 badgeText: '2',*/
                 height: '50%',
                 ui: 'action',
      
                 // ボタンにイベントを設定
                 handler: function() {
                   //add_tapped(this); 
                   var obj = this;
                   if( !this.picker) {
                     this.picker = Ext.Viewport.add({
                       xtype: 'picker',
                       slots: {
                         name: 'action',
                         title: 'Function',
                         data: [
                           {text: 'Say', value: 'Say'},
                           {text: 'Saw', value: 'Saw'},
                           {text: 'Move', value: 'Move'}
                         ]
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
            {//Lower
              xtype: 'panel',
              layout: 'vbox',
              height: '70%',
              items: {
                html: 'Lower Panel',
                height: '100%',
                style: 'background-color: #5E99CC;'
              }
            }
          ]//end item
          }]//navigationview item
    });//Ext.Viewport
  }
});

//Functions
/*var first_add_tapped = function(obj){
  obj.parent.add({
    xtype: 'button',
    iconCls: 'add',
    iconMask: true,
    ui: 'action',
    // ボタンにイベントを設定
    handler: function() {
      test(this);
    }});
}*/

var picker = function(){

}

var add_tapped = function(obj, value){
    //alert("hoge");
    obj.parent.add({
    xtype: 'button',
    text: value.action,
    //iconCls: 'add',
    //iconMask: true,
    ui: 'action',
    // ボタンにイベントを設定
    handler: function() {
      add_tapped(obj);
    }});
}
