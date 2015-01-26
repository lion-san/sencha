Ext.application({
    launch: function() {
        Ext.Viewport.add({
            xtype: 'navigationview',
            items: [{
                xtype: 'panel',
                title: 'First View',    // ナビゲーションバーに表示する文字列
                items : [
                {
                    xtype: 'label',
                    html: 'This is First View'
                },{
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
                }]
            }]
        });
    }
});
