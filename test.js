var panel; 
var hoge;

//Main
Ext.application({
  launch: function() {
    panel = Ext.Viewport.add({
      xtype: 'panel',
      items:[ 
        { xtype: 'label', html: 'Sencha Touch' }
        //,panel1
        ,{
		id:'hoge', xtype: 'button', text: "hoge", hidden: true
	}
        ,{
          xtype: 'button', text: "hoge2",
                 handler: function() {
		   hoge = Ext.ComponentQuery.query('button');
		   hoge[1].show();
		 }
	}
      ] 
    });
  }
});


/**
 * テストコード
*/
var btn1 = Ext.create('Ext.Button', {
	    text: 'Btn1'
});

var panel1 = Ext.create('Ext.Panel', {
	items:[
          btn1
        ]	
});

var hoge = function(){
  alert("hoge");
}

