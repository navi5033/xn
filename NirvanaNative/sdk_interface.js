
console.log("==loaded Test.js!");
var NirvanaNativeUserData = "";
const SDKInterface = {
	InitSDK:function(){
		NirvanaWebGL_CallUnityFuncArg1('onInit','SUCCESS!!!');
	},
	AgentId : function(){
		return "dev";
	},
	Mai : function(requestJson){
		console.log("SDKInterface::Mai===" + requestJson);
		var maiCallback = 
		`
		{
			"sessionId" : "WebGLsesionid",
			"request" : ${requestJson},
			"price" : "30"
		}
		`;
		NirvanaWebGL_CallUnityFuncArg1("onMai" , maiCallback);
	},

	PostMessage : function(requestJson){
		console.log("SDKInterface::PostMessage===" + requestJson);
	},
	
	Login: function(){
		//LoginData
		var loginCallback = 
		`
		{
			"accountId": "WebGLsesionid",
			"userName": "WebGLUserName",
			"token": "WebGLToken",
			"error": "",
			"timeStamp": "999995",
			"customKeyArray": [],
			"customValueArray": []
		}
		`;
		NirvanaWebGL_CallUnityFuncArg1("onLogin",loginCallback);
	},
	
	Logout:function(){
		NirvanaWebGL_CallUnityFuncArg1("onLogout","WebGLLogoutCallbackReason");
	},
	
	
	// enum BehaviourType
    // {
        // SelectServer = 0,		选服
        // CreateRole = 1,			创角
        // RoleLogin = 2,			角色登录
        // LevelUp = 3,				升级
        // RoleLogout = 4,			角色登出
        // ResetRoleName = 5,		改名
        // VipLevelUp = 6,			VIP等级变化
        // GiftCodeUse = 7,        //礼包码的使用
        // Count,
    // }
	BehaviourTrigger:function(behaviour){
		NirvanaWebGL_CallUnityFunc("freshUserInfo");	//获取一下用户信息用于上报 
		console.log("BehaviourTrigger==" + behaviour + "\nUserData=" + NirvanaNativeUserData);
	},
	
	OnRefreshUserData:function(userDataJson){
		console.log("OnRefreshUserData===" + userDataJson);
		NirvanaNativeUserData = userDataJson;
	},
	
	PlatInfo : function(){
		var userAgentInfo = navigator.userAgent;
		// userAgentInfo = "iPhone13";
		var platName = "unknow";
		if (userAgentInfo.indexOf("Android") >= 0){
			platName = "android";
		}
		else if(userAgentInfo.indexOf("iPhone") >= 0 ||
			userAgentInfo.indexOf("iPad") >= 0 ||
			userAgentInfo.indexOf("iPod") >= 0)
		{
			platName = "ios";
		}
		else
		{
			platName = "pc";
		}
		// console.error(`userAgentInfo===${userAgentInfo}`);
		var re = `{
			"facebookShow":0,
			"moreBuyShow":0,
			"facebookEffectShow":0,
			"evalShow":0,
			"isPlatInfoReady":true,
			"webGLPlat":"${platName}"
		}`;
		// console.error(`[PlatInfo] WebGL Palt No Impletement! Return Default=${re}`);
		return re;
	},
	BatteryLevel:function(){
		return 100;
	},
	ShowModal:function(modalData){
    	//console.error(`[ShowModal] WebGL Palt No Impletement!modalData=${modalData}`);
		
	var sn_obj = JSON.parse(modalData);
        let title = '';
        let content = '';
        let confirmText = '确定';
        let cancelText = '取消';
        if(sn_obj.title!=undefined&&sn_obj.title!='') {title = sn_obj.title;}
        if(sn_obj.content!=undefined&&sn_obj.content!='') {content = sn_obj.content;}
        if(sn_obj.confirmText!=undefined&&sn_obj.confirmText!='') {confirmText = sn_obj.confirmText;}
        if(sn_obj.cancelText!=undefined&&sn_obj.cancelText!='') {cancelText = sn_obj.cancelText;}

        let notifi = '<div class="laytc-ui-shade" id="laytcShade"></div><div class="laytc-ui laytc-ui-dialog" id="laytcDialog"><div class="laytc-ui-title">'+title+'</div><div class="laytc-ui-content">'+content+'</div><div class="laytc-ui-btn"><a class="laytc-ui-btn1">'+confirmText+'</a>';
        if(sn_obj.showCancel) {notifi += '<a class="laytc-ui-btn2">'+cancelText+'</a>';}
        notifi += '</div>';

        var div=document.createElement("div");
        div.setAttribute('class', 'laytc-ui-box');
        div.innerHTML = notifi;
        document.body.appendChild(div)

        document.getElementsByClassName('laytc-ui-btn1')[0].addEventListener("click", function() {
            // 确定 九 零一起玩www.90 175.com
            document.getElementById('laytcShade').remove();
            document.getElementById('laytcDialog').remove();
			NirvanaWebGL_CallUnityFunc("onDialogConfirm");
        });
		if(sn_obj.showCancel){
			document.getElementsByClassName('laytc-ui-btn2')[0].addEventListener("click", function() {
				// 取消
				document.getElementById('laytcShade').remove();
				document.getElementById('laytcDialog').remove();
				NirvanaWebGL_CallUnityFunc("onDialogCancel");
			});
		}
	}
	
};

(window || global).SDKInterface = SDKInterface;
console.log("!!!!!!~~~loaded Test.jsEND!!!" + (window || global) + "," + window.SDKInterface);

function NirvanaWebGL_CallInteface(func_name){
	// console.log("NirvanaWebGL_CallInteface::func_name==" + func_name)
	return (window || global).SDKInterface[func_name]()
}

function NirvanaWebGL_CallIntefaceArg1(func_name,arg1)
{
	// console.log("func_name==" + func_name)
	return (window || global).SDKInterface[func_name](arg1)
}

// function NirvanaWebGL_JSStringToCBuffer(str)
// {
	// var bufferSize = lengthBytesUTF8(str) + 1;
    // var buffer = _malloc(bufferSize);
    // stringToUTF8(str, buffer, bufferSize);
    // return buffer;
// }

function NirvanaWebGL_CallUnityFunc(func_name)
{
	gameInstance.SendMessage('ChannelAgentEventListener', func_name);
}

function NirvanaWebGL_CallUnityFuncArg1(func_name,arg1)
{
	gameInstance.SendMessage('ChannelAgentEventListener', func_name,arg1);
}
