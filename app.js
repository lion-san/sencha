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
            {
              xtype: 'button',
              text: 'Push Next View',
                  
              // ボタンにイベントを設定
              handler: function() {

                // このコンポーネントの2つ上の navigationview で定義されたメソッド
                this.parent.parent.push({
                  xtype: 'panel',
                  title: 'Second View',
                  items: [{
                    xtype: 'label',
                    html: 'This is Second View' // 画面遷移後にナビゲーションバーに表示する文字列
                   }]
                });
               }
             },
            {
              xtype: 'toolbar',
            　items: [{
            　   xtype: 'button',
                 iconCls: 'add',
                 iconMask: true,
                 badgeText: '2',
                 ui: 'action',
                 scrollable: {
                   direction: 'horizontal'
                 },
      
                 // ボタンにイベントを設定
                 handler: function() {

                  this.parent.add({
               　   xtype: 'button',
                    iconCls: 'add',
                    iconMask: true,
                    ui: 'action',
                    // ボタンにイベントを設定
                    handler: function() {
                        this.parent.push({
                    });}
                  });
                 }
              }]
            }
          ]//end item
          }]//navigationview item
    });//Ext.Viewport
  }
});

