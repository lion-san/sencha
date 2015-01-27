var addBtn;

//Action�ǉ��{�^���u�{�v
var currentAddActionBtn;

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
            title: 'Program mode',    // �i�r�Q�[�V�����o�[�ɕ\�����镶����
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
            �@items: [
              {
            �@   xtype: 'button',
                 text: 'Add',
                 iconCls: 'add',
                 iconMask: true,
                 margin: 5,
                 //badgeText: '2',
                 height: '44px',
                 ui: 'round',
      
                 // �{�^���ɃC�x���g��ݒ�
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
//���i�̃��C�A�E�g
{
//ActionPanel
  xtype: 'panel',
  layout: 'vbox',
  height: '70%',
  scrollable: true,
  items: [
  {
    html: 'Action',
    style: 'background-color: #5E99CC;'
  },
  {
//Action�ǉ��{�^���u�{�v
      xtype: 'button',
      //hidden: true, //�����͉B��
      iconCls: 'add',
      iconMask: true,
      height: '66px',
      handler: function() {
        
        //Floating panel
        actionFloatPanel = Ext.create('Ext.Panel', {
        centered: true,
        width: '100%',
        items: [
        {//--------------------------
            defaults: {
              xtype: 'button',
              margin: 5,
              width: '44px',
              height: '44px',
              iconMask: true
            },
            layout: 'hbox',
            items: [ 
                { iconCls: 'action' },//1
                { iconCls: 'add' },
                { iconCls: 'arrow_down' },
                { iconCls: 'arrow_left' },
                { iconCls: 'compose' },
           ] 
        },//--------------------------
        {//---------------------------
            defaults: {
              xtype: 'button',
              margin: 5,
              width: '44px',
              height: '44px',
              iconMask: true
            },
            layout: 'hbox',
            items: [ 
                { iconCls: 'compose' },
                { iconCls: 'delete' },
                { iconCls: 'organize' },
                { iconCls: 'refresh' },
                { iconCls: 'reply' },
           ] 
        },//--------------------------
        {//---------------------------
            defaults: {
              xtype: 'button',
              margin: 5,
              width: '44px',
              height: '44px',
              iconMask: true
            },
            layout: 'hbox',
            items: [ 
                { iconCls: 'search' },
                { iconCls: 'settings' },
                { iconCls: 'star' },
                { iconCls: 'trash' },
                { iconCls: 'maps' },
           ] 
        },//----------------------------
        {//-----------------------------
            defaults: {
              xtype: 'button',
              margin: 5,
              width: '44px',
              height: '44px',
              iconMask: true
            },
            layout: 'hbox',
            items: [ 
                { iconCls: 'locate' },
                { iconCls: 'home' },
                { xtype: 'spacer' },
                { xtype: 'spacer' },
                { xtype: 'spacer' }
           ] 
       },//--------------------------------
       {
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
        }
        ]//item
        });
        //Float�p�l���̕\��
        this.parent.parent.add(actionFloatPanel);
     }
  }
  ]
}
          ]//end item
          }]//navigationview item
    });//Ext.Viewport
  }
});

//Functions
/**
 * 
 */
var add_tapped = function(obj, value){
    //alert("hoge");
    //�I�������{�^���̕`��
    obj.parent.add({
    xtype: 'button',
    text: value.action,//�I�������l�̃{�^���𐶐�
    height: '44px',
    ui: 'action',
    margin: 5,
    // �{�^���ɃC�x���g��ݒ�
    handler: function() {
      add_tapped(obj);
    }});

    //Add Button�̍ĕ`��
    obj.parent.add({
             �@   xtype: 'button',
                 text: 'Add',
                 iconCls: 'add',
                 iconMask: true,
                 //badgeText: '2',
                 height: '44px',
                 ui: 'round',
                 margin: 5,
      
                 // �{�^���ɃC�x���g��ݒ�
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

    //�C�x���g�g���K�[��addBtn�̍폜
    obj.parent.remove(addBtn);

    //ActionBtn�̕\��
    //
}

//���X�g
var makeList = function(){
  var json = [             {text: events.say, value: events.say},
                           {text: events.saw, value: events.saw},
                           {text: events.pan, value: events.pan},
                           {text: events.move, value: events.move},
                           {text: '', value: 'null'}];
  return json;
}

//Value�ƃC�x���g�̃}�b�v
var events = { 
  "say": "���������m",
  "saw": "�N����������",
  "pan": "���������",
  "move": "��������m"
};


/**
 * �e�X�g�R�[�h
*/
var myPanel = function(){
  return Ext.create('Ext.Panel', {
  items:  [
    {xtype: 'button',
      text: 'TEST!!!!',
      height: '66px',
      enable: true,
      initialize: function(){alert("hoge");}}
    ]
  });
}
var hoge = function(){
  alert("hoge");
}

