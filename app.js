var addBtn;

var naviView;
var mainPanel;
var actionFloatPanel;

var eventPanel;
var currentActionPanel;
var actionPanels = new Array();//�C�x���g���̃A�N�V�����X�^�b�N
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
            title: 'Program mode',    // �i�r�Q�[�V�����o�[�ɕ\�����镶����
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
  //EventAddButton�̐���
  var panels  = Ext.ComponentQuery.query('panel');
  eventPanel = getObjectById(panels, 'eventPanel');
  eventPanel.add(createEventAddBtn());
  
  //�C���X�^���X�̎擾
  var navis  = Ext.ComponentQuery.query('navigationview');
  naviView = getObjectById(navis, 'naviView');

  mainPanel = getObjectById(panels, 'mainPanel');
  actionPanel = getObjectById(panels, 'actionPanel');

  //ActionFloatPanel�̐���
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
 * EventAddBtn�̐���
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
      
                 // �{�^���ɃC�x���g��textfield�ݒ�
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
 * ActionFloatPanel�̐���
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

  actionPanels.push(panel);//�X�^�b�N�Ƀv�b�V��
  currentActionPanel = panel;

  //+�{�^���̒ǉ�
  panel.add(createActionPlusBtn());
  return panel;
}

//Action�ǉ��{�^���u�{�v
var createActionPlusBtn = function() {

  var id = 'plus' + eventCount;

  var plus = Ext.create('Ext.Button', {
      id: id,
      iconCls: 'add',
      iconMask: true,
      height: '66px',
      handler: function() {
      //ActionFloatPanel�̕\��
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


//Value�ƃC�x���g�̃}�b�v
var events = { 
  "say": "���������m",
  "saw": "�N����������",
  "pan": "���������",
  "move": "��������m"
};

//--- create end ----------------------------------------------


//--- event start ----------------------------------------------

/**
 * eventAddBtnTapped
 */
var eventAddBtnTapped = function(obj, value){

  
  //�����̂��̂�����Ώ���
  if(eventCount > 0)
    currentActionPanel.hide();

    //�C�x���g�����ǉ����̃J�E���g�A�b�v
    eventCount = eventCount + 1;

    var eventId = 'event' + eventCount;

  //�C�x���g�̏������͂�
  //Action Mode
  switch (value.action){
    case "say":
      naviView.push(eventSaid(eventId, events.say));
      break;

    default:
      eventCount = eventCount - 1;
      alert(obj.id + "�́A���g���܂���B");
      break;
  }

}

//Sub Function
var eventSaid = function(eventId, btnName){
  var panel = Ext.create('Ext.Panel', {
    title: 'What human say?',
    items: [
      {xtype: 'label', html: '��v������I�����Ă�'},
      {xtype: 'selectfield', name: 'options', id: 'ifsay',
        options: [
          {text: '������v������', value: '='},
          {text: '���S��v������', value: '=='}
        ]
      },
      {xtype: 'label', html: '��������͂��Ă�'},
      {xtype: 'textfield', id:'whatsay'},
      {xtype: 'button', text: '�o�^', ui: 'action',
        handler: function() {//�o�^�{�^������������
          //���͒l�̎擾
          var objs  = Ext.ComponentQuery.query('textfield');
          var obj = getObjectById(objs, 'whatsay');
          var input2 = obj.getValue();

          objs  = Ext.ComponentQuery.query('selectfield');
          obj = getObjectById(objs, 'ifsay');
          var input1 = obj.getValue();
          if(input1 == "==")
            input1 = "���S";
          else
            input1 = "����";
         

          if(nullCheck(input2, "��������͂��Ă�")){
            //�I�������{�^���̕`��
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
    text: btnName,//�I�������l�̃{�^���𐶐�
    height: '44px',
    ui: 'action',
    margin: 5,
    // �{�^���ɃC�x���g��ݒ�
    handler: function() {
      eventBtnTapped(this.id);
    }
  });

  return btn;
}

//Sub Function
var removeAndCreateEventAddBtn = function(){

    //Add Button�̍ĕ`��
    eventPanel.add(
      createEventAddBtn()
    );

    //�C�x���g�g���K�[��addBtn�̍폜
    eventPanel.remove(addBtn);

    //Action add button�̐���
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

  //Action Stack�ɒǉ�


  //Action Mode
  switch (obj.id){
    case "talk":
      //alert(obj.id);
      //Add ActionItem
      naviView.push(programingTalk(obj.id));
      actionFloatPanel.hide();
      break;

    case "light":
      addActionBtn("����");
      actionFloatPanel.hide();
      break;

    case "camera":
      addActionBtn("�ʐ^���B��");
      actionFloatPanel.hide();
      break;

    case "wait":
      naviView.push(programingWait(obj.id));
      actionFloatPanel.hide();
      break;

    default:
      alert(obj.id + "�́A���g���܂���B");
      break;
  }
}
//sub function
var programingTalk = function(id){
  var panel = Ext.create('Ext.Panel', {
    title: 'I can talk',
    items: [
      {xtype: 'label', html: '�����Ƀ��b�Z�[�W����͂��ĂˁB'},
      {xtype: 'textfield', id:'talktext'},
      {xtype: 'button', text: '�o�^', ui: 'action',
        handler: function() {//�o�^�{�^������������
          //���͒l�̎擾
          var objs  = Ext.ComponentQuery.query('textfield');
          var obj = getObjectById(objs, 'talktext');
          var input = obj.getValue();

          if(nullCheck(input, "���b�Z�[�W����͂��Ă�")){
            //�{�^���𐶐����āA�߂�
            currentActionPanel.add(addActionBtn("�b�� [" + input + "]"));
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
      {xtype: 'label', html: '���b�҂Ă΂����H'},
      {xtype: 'textfield', id:'waittime'},
      {xtype: 'button', text: '�o�^', ui: 'action',
        handler: function() {//�o�^�{�^������������
          //���͒l�̎擾
          var objs  = Ext.ComponentQuery.query('textfield');
          var obj = getObjectById(objs, 'waittime');
          var input = obj.getValue();

          //�{�^���𐶐����āA�߂�
          if(nullCheck(input, "�҂����Ԃ���͂��Ă�")){
            currentActionPanel.add(addActionBtn("[" + input + "] �b�҂�"));
            naviView.pop();
          }
        }
      }
    ]
  });

  return panel;
}



/**
 * �I�������A�N�V�����{�^���̕`��
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

