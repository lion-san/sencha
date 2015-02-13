var addBtn;

var naviView;
var mainPanel;
var actionFloatPanel;

var eventPanel;
var currentActionPanel;
var actionPanels = new Array();//�C�x���g���̃A�N�V�����X�^�b�N
var allEvents = new Array();//�S�C�x���gJSON���X�g
var actions = new Array();//�S�A�N�V����JSON���X�g
var currentActions = new Array();//�A�N�V�����pJSON
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
                 badgeText: 'v3',
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

  //currentActions�̐ݒ�
  currentActions = new Array();
  actions.push( currentActions );
  
  //�����̂��̂�����Ώ���
  if(eventCount > 0)
    currentActionPanel.hide();

    var eventId = 'event' + eventCount;

  //�C�x���g�̏������͂�
  //Action Mode
  switch (value.action){
    case "say":
      naviView.push(eventSaid(eventId, events.say));
      break;

    default:
      Ext.Msg.alert(obj.id + "�́A���g���܂���B");
      return;
      //break;
  }

    //�C�x���g�����ǉ����̃J�E���g�A�b�v
    eventCount = eventCount + 1;
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
          if(input1 == "=="){
            input1 = "���S";

            //JSON��Push
            var json = {"event": "say", "type" : "=="};
            allEvents.push( json );
          }
          else{
            input1 = "����";
            var json = {"event": "say", "type" : "="};
            allEvents.push( json );
          }
         

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
//�C�x���g�i�����j�{�^���̐���
var createEventBtn = function(eventId, btnName){
  var btn = Ext.create('Ext.Button', {
    id: eventId,
    text: btnName,//�I�������l�̃{�^���𐶐�
    height: '44px',
    ui: 'action',
    margin: 5,
    // �{�^���ɃC�x���g��ݒ�
    handler: function() {
      //�J�����g�A�N�V�����z��̕t���ւ�
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
      Ext.Msg.alert(obj.id + "�́A���g���܂���B");
      return;
      //break;
  }
 
}

//sub function
var programingTalk = function( json ){

  //�C���̏ꍇ
  if( json != null){
  var panel = Ext.create('Ext.Panel', {
    title: 'I can talk',
    items: [
      {xtype: 'label', html: '�����Ƀ��b�Z�[�W����͂��ĂˁB'},
      {xtype: 'textfield', id:'talktext', value: json.param },
      {xtype: 'button', text: '�o�^', ui: 'action',
        handler: function() {//�o�^�{�^������������
          //���͒l�̎擾
          var objs  = Ext.ComponentQuery.query('textfield');
          var obj = getObjectById(objs, 'talktext');
          var input = obj.getValue();

          if(nullCheck(input, "���b�Z�[�W����͂��Ă�")){

          objs  = Ext.ComponentQuery.query('button');
          obj = getObjectById(objs, json.id);
          obj.setText("�b�� [" + input + "]");
            
            //Json���X�V
            json.param = input;

            //�߂�
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
      {xtype: 'label', html: '�����Ƀ��b�Z�[�W����͂��ĂˁB'},
      {xtype: 'textfield', id:'talktext'},
      {xtype: 'button', text: '�o�^', ui: 'action',
        handler: function() {//�o�^�{�^������������
          //���͒l�̎擾
          var objs  = Ext.ComponentQuery.query('textfield');
          var obj = getObjectById(objs, 'talktext');
          var input = obj.getValue();

          if(nullCheck(input, "���b�Z�[�W����͂��Ă�")){

            var btn = addActionBtn("�b�� [" + input + "]");

            //Json�ɏo��
            addActionJson(btn.id, "talk", input, true);

            //�{�^���𐶐����āA�߂�
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

  //�C���̏ꍇ
  if( json != null){

    //Navi��ʂ̐���
  var panel = Ext.create('Ext.Panel', {
    title: 'I am waiting ',
    items: [
      {xtype: 'label', html: '���b�҂Ă΂����H'},
      {xtype: 'textfield', id:'waittime', value: json.param },
      {xtype: 'button', text: '�o�^', ui: 'action',
        handler: function() {//�o�^�{�^������������
          //���͒l�̎擾
          var objs  = Ext.ComponentQuery.query('textfield');
          var obj = getObjectById(objs, 'waittime');
          var input = toHankaku( obj.getValue() );

          objs  = Ext.ComponentQuery.query('button');
          obj = getObjectById(objs, json.id);
          
          //�{�^���𐶐����āA�߂�
          if(nullCheck(input, "�҂����Ԃ���͂��Ă�")){
            if(numberCheck(input, "��������͂��Ă�")){

            obj.setText("[" + input + "] �b�҂�");
            
            //Json���X�V
            json.param = input;

            //�߂�
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
      {xtype: 'label', html: '���b�҂Ă΂����H'},
      {xtype: 'textfield', id:'waittime'},
      {xtype: 'button', text: '�o�^', ui: 'action',
        handler: function() {//�o�^�{�^������������
          //���͒l�̎擾
          var objs  = Ext.ComponentQuery.query('textfield');
          var obj = getObjectById(objs, 'waittime');
          var input = toHankaku( obj.getValue() );

          //�{�^���𐶐����āA�߂�
          if(nullCheck(input, "�҂����Ԃ���͂��Ă�")){
            if(numberCheck(input, "��������͂��Ă�")){
            var btn  = addActionBtn("[" + input + "] �b�҂�");
            
            //Json�ɏo��
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

    var btn = addActionBtn("�ʐ^���B��");

    //Json�ɏo��
    addActionJson(btn.id, "camera", null, false);
}

//sub function
var programingLight = function(){

    var btn = addActionBtn("����");

    //Json�ɏo��
    addActionJson(btn.id, "light", null, false);
}

/**
 * �I�������A�N�V�����{�^���̕`��
 */
var addActionBtn = function(text){

  var newBtn = Ext.create('Ext.Button', {
    text: text,
    handler: function(){
      //JSON�̌���
      var json = getJsonById( this.id ); 

      //�ҏW�\�{�^���̂݁A�i�r�\��
      if(json.modify){

        //Navi��ʂւ̑J��
        //�_�~�[�I�u�W�F�N�g
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
 * �v���W�F�N�g�̕ۑ�
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

      //Actions�̃R���}�폜����
      json = json.substr(0, json.length-2);
      json += "]";

      json += "},\n";

    }
  }
  //Events�Ō�̃R���}�폜����
  json = json.substr(0, json.length-2);//�R���}+���s�R�[�h

  json += "]";

  Ext.Msg.alert("�ۑ����܂����I");

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
      //��M�������̏���
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
  
  var val =  input.replace( /[�O-�X]/g, function(s) {
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


