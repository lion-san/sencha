Ext.application({
  launch: function() {
    Ext.Viewport.add({
      xtype: 'navigationview',
        items: [
          {//panel_1
            xtype: 'panel',
            title: 'Program mode',    // �i�r�Q�[�V�����o�[�ɕ\�����镶����
            items : [//start item
            {
              xtype: 'label',
              html: 'Program mode'
            },
            {
              xtype: 'button',
              text: 'Push Next View',
                  
              // �{�^���ɃC�x���g��ݒ�
              handler: function() {

                // ���̃R���|�[�l���g��2��� navigationview �Œ�`���ꂽ���\�b�h
                this.parent.parent.push({
                  xtype: 'panel',
                  title: 'Second View',
                  items: [{
                    xtype: 'label',
                    html: 'This is Second View' // ��ʑJ�ڌ�Ƀi�r�Q�[�V�����o�[�ɕ\�����镶����
                   }]
                });
               }
             },
            {
              xtype: 'container',
              layout: 'hbox',
            �@items: [{
            �@   xtype: 'button',
                 iconCls: 'add',
                 iconMask: true,
                 badgeText: '2',
                 ui: 'action',
                 scrollable: {
                   direction: 'horizontal'
                 },
      
                 // �{�^���ɃC�x���g��ݒ�
                 handler: function() {

                  this.parent.add({
               �@   xtype: 'button',
                    iconCls: 'add',
                    iconMask: true,
                    ui: 'action',
                    // �{�^���ɃC�x���g��ݒ�
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
