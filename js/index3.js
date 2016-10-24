;(function (){

	//////////////////  header  //////////////////  header //////////////////  header //////////////////  
	var user = tools.$("#_main_face");		//获取用户栏
	var body = tools.$("body")[0];	
	var mainFaceMenu = tools.$("._main_face_menu")[0];	//获取用户栏菜单
	mainFaceMenu.state = true;

	body.style.height = tools.view().H + "px";			//body的高度等于视口高度
	window.onresize = function (){						//body的高度等于视口高度
		body.style.height = tools.view().H + "px";			
	}
	user.onmouseenter = function (){						//鼠标移入用户栏
		this.style.borderColor = "#c8ccd5";				
		this.style.borderBottomColor = "#fff"; 
		mainFaceMenu.style.display = "block";
	}
	user.onmouseleave = function (){
		user.timer = setTimeout(function (){
			user.style.borderColor = "#fff";
			mainFaceMenu.style.display = "none";
		},500)
	}
	mainFaceMenu.onmouseenter = function (){
		clearTimeout(user.timer)
		this.style.display = "block";    
		user.style.borderColor = "#c8ccd5";
		user.style.borderBottomColor = "#fff"; 
	}
	mainFaceMenu.onmouseleave = function (){
		setTimeout(function (){
			user.style.borderColor = "#fff";
			mainFaceMenu.style.display = "none";
		},500)	
	}

	//////////////////  main  //////////////////  main  //////////////////  main  //////////////////  
	var main = tools.$("#main");
	var mianNavBox = tools.$(".mianNavBox")[0];
	var layHeader = tools.$(".lay-header")[0];
	var wrap = tools.$(".wrap")[0];
	var layMainToolbar = tools.$(".lay-main-toolbar")[0];
	var checkedArr = [];				//数组储存被选中的文件夹的data-id
	var mask = tools.$("#Mask");
	var treeMenu = tools.$(".tree-menu")[0];
	
	changeHeight();

	function changeHeight(){	//改变宽高的函数
		var clinetH = tools.view().H;  //可视区的高
		main.style.height = clinetH - layHeader.offsetHeight-5 + "px";
		wrap.style.height = main.offsetHeight - layMainToolbar.offsetHeight + "px";
		treeMenu.style.height = wrap.offsetHeight +"px";	
	}
	//绑定一个resize
	window.addEventListener("resize",changeHeight);


	//////////////////  warp  //////////////////  warp  //////////////////  warp  //////////////////  
	var datas = data.files;								//获取文件夹的数据
	var wrapList = tools.$(".wrap-list")[0];			//文件夹列表
	var pathBox = tools.$(".wrap-top-pathBox")[0];		//获取到路径栏的容器
	var treeMenu = tools.$(".tree-menu")[0];			//获取到树形菜单的容器
	var checkAll = tools.$(".wrap-top-checkBox",wrap)[0];	//全选框

	//初始化结构////////////////////////////
	var initId = 0;										//设置初始化id 为0
	wrapList.innerHTML = creatFn.createWrapList(datas,initId);					//渲染文件夹列表
	pathBox.innerHTML = creatFn.createPathBox(datas,initId);					//渲染路径栏
	treeMenu.innerHTML = creatFn.createTreeMenu(datas,-1);					//渲染树形菜单
	var isDrag = false;
	var noClick = false;
	//////////////////  wrapList  //////////////////  wrapList  //////////////////  wrapList  //////////////
	var treeNav = tools.$(".tree-nav")[0];					//树形菜单当前项
	wrapList.addEventListener("mouseover",function (ev){	//鼠标移入文件夹
		var folder = tools.parents(ev.target,".folder");	
		if(folder && !!folder.dataset.state && !isDrag){												//如果获取到了文件夹
			var checkBox = tools.$(".check-box",folder)[0];		//获取选项框
			if(checkBox){									//如果有选项框
				checkBox.style.display = "block";			//显示选项框
			}
			tools.addClass(folder,"mouseover");			
		}
	},false)

	wrapList.addEventListener("mouseout",function (ev){		//鼠标移出文件夹
		var folder = tools.parents(ev.target,".folder");
		if(folder && !!folder.dataset.state){												//如果获取到了文件夹
			var checkBox = tools.$(".check-box",folder)[0];		//获取选项框
			if(checkBox){
				checkBox.style.display = "none";
			}
			tools.removeClass(folder,"mouseover");			
		}
	},false)

	wrapList.addEventListener("click",function (ev){		//鼠标点击文件夹
		var folder = tools.parents(ev.target,".folder");	
		if(folder){												//如果获取到了文件夹
			var checkBox = tools.$(".check-box",folder)[0];		//获取选项框
			if(ev.target.nodeName === "SPAN" ){					//如果点击的是Span
				if(!!folder.dataset.state){		//当文件夹的state为true时
					if(checkBox){
						tools.addClass(checkBox,"checked");
					}
					folder.dataset.state = "";
					tools.addClass(folder,"Checked");
				}else {
					tools.removeClass(checkBox,"checked");
					folder.dataset.state = "true";
					tools.removeClass(folder,"Checked")
				}
				ev.stopPropagation();	
			}else if(ev.target.nodeName === "INPUT"){
				return;
			}else {												//如果点击的是span以外
				var folderId = folder.dataset.id;					//获取文件的id
				wrapList.innerHTML = creatFn.createWrapList(datas,folderId);				//渲染文件夹列表
				pathBox.innerHTML = creatFn.createPathBox(datas,folderId);					//渲染路径栏
				currentTree(folderId)		//树形菜单定位
			}	
			checkAllOnOff();	
			checkedArr = checkedArrFn();
			console.log(checkedArr)			
		}
		ev.stopPropagation;
	},false)

	pathBox.addEventListener("click",function (ev){			//点击路径
		var folderId = ev.target.dataset.id
		console.log(folderId)
		wrapList.innerHTML = creatFn.createWrapList(datas,folderId);				//渲染文件夹列表
		pathBox.innerHTML = creatFn.createPathBox(datas,folderId);					//渲染路径栏
		currentTree(folderId);
		checkAllOnOff();	
		checkedArr = checkedArrFn();
		console.log(checkedArr)	
		ev.stopPropagation();	
	})

	treeMenu.addEventListener("click",function (ev){		//点击树形菜单
		var treeTitle = tools.parents(ev.target,".tree-title");
		var treeTitleId = treeTitle.dataset.id;
		wrapList.innerHTML = creatFn.createWrapList(datas,treeTitleId);				//渲染文件夹列表
		pathBox.innerHTML = creatFn.createPathBox(datas,treeTitleId);					//渲染路径栏
		currentTree(treeTitleId)
		checkAllOnOff();	
		checkedArr = checkedArrFn();
		console.log(checkedArr)	
		ev.stopPropagation();
	})

	//////////////////  toolbar  //////////////////  toolbar  //////////////////  toolbar  //////////////////  
	var promptNoChooseBox = tools.$("#prompt-no-choose-box"); 			//未选中文件时的弹出框
	var promptCancelBtn = tools.$(".prompt-cancel-btn");			//叉叉
	var promptBoxCancelBtn = tools.$(".prompt-box-cancel-btn");  	//取消按钮
	var fullTipBox = tools.$(".full-tip-box")[0];
	

	////// 新建文件夹按钮 ///////////////////// 新建文件夹按钮 /////////////////////
	var newFolderBtn = tools.$("#new-Folder-btn");	
	newFolderBtn.addEventListener("click",function (ev){		//给新建文件夹按钮绑定点击事件处理，
		if(this.isCreateFile){
			return;
		}
		this.isCreateFile = true;
		var currentPath = tools.$(".currennt-path")[0];			//获取到当前路径
		var pid = currentPath.dataset.id;						//获取到当前路径的id作为新建文件夹的父id
		var NewFolder = creatFn.createNewFolder(pid);					//声明一个变量用来储存新建文件夹的结构

		wrapList.insertBefore(NewFolder,wrapList.firstElementChild);//把新建的文件夹放入列表中

		var folderInput = tools.$(".folder-input",NewFolder)[0];	//声明一个变量用来储存新建文件夹的输入框
		folderInput.focus();	

		folderInput.addEventListener("click",function (ev){
	        ev.stopPropagation();    
	    })
	    folderInput.addEventListener("mousedown",function (ev){
	        ev.stopPropagation();    
	    })									//新建时输入框自动获取焦点
	    folderInput.addEventListener("keydown",function (ev){	//当enter键按下时
			if(ev.keyCode === 13){
				NewFolderStateFn()								
			}
		},false)
		ev.stopPropagation();
	},false)
	document.addEventListener("mousedown",NewFolderStateFn,false);			//当document鼠标按下时
	function NewFolderStateFn(ev){	
		if( newFolderBtn.isCreateFile ){
			var NewFolder = wrapList.firstElementChild;
			var folderName = tools.$(".folder-name",NewFolder)[0];	//获取储存文件名的元素
			var folderInput = tools.$(".folder-input",NewFolder)[0];
			var pid = NewFolder.dataset.pid;
			var val = folderInput.value;									//储存输入框的value
			if(val.trim() === ""){									//如果val为空，证明没有输入文件名
				wrapList.removeChild(NewFolder);					//则删除新建的文件夹
			}else if(dataAction.reName(datas,pid,val)){				//如果文件夹重名了，则新建不成功
				wrapList.removeChild(NewFolder);					//则删除新建的文件夹
				fullTip("err","文件名有冲突");
			}else{
				folderName.innerHTML = val;
				folderInput.style.display = "none";					//隐藏输入框	
				NewFolder.insertBefore(creatFn.createNewCheckBox(),NewFolder.firstElementChild);	//给文件夹添加一个checkBox

				var newFile = {};		//新建数据
				newFile.id = NewFolder.dataset.id;
				newFile.pid = NewFolder.dataset.pid;
				newFile.title = val;
				newFile.type = "file";
				datas.unshift(newFile);  //新建的数据插入数据库

				fullTip("ok","新建文件夹成功");

				checkAllOnOff(); 			//判断是否全选///
				treeMenu.innerHTML = creatFn.createTreeMenu(datas,-1);		//重新渲染树形菜单
				treeNav = tools.$(".tree-nav")[0];							//重新获取树形菜单当前项
				currentTree(pid);
				checkAllOnOff(); 			//判断是否全选
			}
		}
		newFolderBtn.isCreateFile = false;
	}
	////// 全选按钮 //////////////////////// 全选按钮 //////////////////////
	checkAll.state = true;
	checkAll.addEventListener("click",function (ev){	//点击全选
		console.log(checkAll.state)
		var files = tools.$(".folder",wrapList);		//获取到所有的文件夹

		for (var i = 0; i < files.length; i++) {
			var checkBox = tools.$(".check-box",files[i])[0];			//获取每一个选项框
			if(checkAll.state){											//如果全选被选中
				tools.addClass(checkAll,"checkAll-checked");			//显示所有的选项框
				checkBox.style.display = "block";	
				tools.addClass(checkBox,"checked");						//选中文件夹
				files[i].dataset.state = "";
				tools.addClass(files[i],"Checked");
			}else {
				tools.removeClass(checkAll,"checkAll-checked");
				checkBox.style.display = "none";
				tools.removeClass(checkBox,"checked");
				files[i].dataset.state = "true";
				tools.removeClass(files[i],"Checked");
				tools.removeClass(files[i],"mouseover");
			}
		}
		checkAll.state = !checkAll.state;
		checkedArr = checkedArrFn();
		console.log(checkedArr)
		ev.stopPropagation();
	},false)

	////// 自由选框 ////////////////////////// 自由选框 //////////////////////
	var selectionBox = null;  	//自由选框
	var beginX = 0;    	//鼠标按下时的Y轴坐标
	var beginY = 0;		//鼠标按下时的X轴坐标	

	document.addEventListener("mousedown",function (ev){
        var target = ev.target;
        
        if( tools.parents(target,".handleFile") || 
            tools.parents(target,".tree-menu")  ||
            tools.parents(target,".lay-aside")  ||
            tools.parents(target,".folder-input")
          ){
            return;
        }
		ev.preventDefault(); 
		var files = tools.$(".folder",wrapList);	//获取到所有的文件夹
		beginX = ev.clientX;
		beginY = ev.clientY;
		
		for (var i = 0; i < files.length; i++) {
			tools.removeClass(files[i],"mouseover");
		}

		//拖拽移动	碰撞移动
		if( tools.parents(target,".folder") ){	//如果按下的是文件夹
			document.addEventListener("mousemove",moveFileFn,false);	//鼠标移动
			document.addEventListener("mouseup",upFileFn,false);	//鼠标移动
            shadowTarget = tools.parents(target,".folder");
            console.log(shadowTarget)
            return;
        }
		document.addEventListener("mousemove",selectionBoxFn,false);	//鼠标移动
		document.addEventListener("mouseup",function fn(){
			document.removeEventListener("mousemove",selectionBoxFn,false);
			if(selectionBox){
				document.body.removeChild(selectionBox);
				selectionBox = null;
			}
			document.removeEventListener("mouseup",selectionBoxFn,false);
		},false)
		
		document.addEventListener("click",function (){
			if(!noClick){
				for (var i = 0; i < files.length; i++) {
					var checkBox = tools.$(".check-box",files[i])[0];			//获取每一个选项框
					tools.removeClass(checkAll,"checkAll-checked");
					checkBox.style.display = "none";
					tools.removeClass(checkBox,"checked");
					files[i].dataset.state = "true";
					tools.removeClass(files[i],"Checked");
					tools.removeClass(files[i],"mouseover");
				}
				checkAll.state = true;
				checkedArr = checkedArrFn();
			}
		},false)
		
	////// 删除按钮 ////////////////////////// 删除按钮 ///////////////////////
	var removeBtn = tools.$("#toolbar-remove-btn");
	var promptRemoveBox = tools.$("#prompt-remove-box");				//删除弹出框
	var promptRemoveBoxConfirmBtn = tools.$(".prompt-remove-box-confirm-btn")[0];	//确认按钮
	
	//点击叉叉按钮
	for (var i = 0; i < promptCancelBtn.length; i++) {
		
		promptCancelBtn[i].onclick = function (){
			console.log(123)
			mask.style.display = "none";			//隐藏遮罩层
			promptRemoveBox.style.display = "none";	//隐藏提示框
			promptMoveBox.style.display = "none";
			noClick = false;
		}
	}

	removeBtn.addEventListener("click",function(ev){
		var currentPath = tools.$(".currennt-path")[0];		//找到当前路径
		var currentId = currentPath.dataset.id;					
		var checkedArr = checkedArrFn();				//获取选中文件夹id

		if(checkedArr.length > 0){						//被选中的文件夹数量大于0 时
			mask.style.display = "block";				//显示遮罩层
			noClick = true;
			promptRemoveBox.style.display = "block";	//显示提示框
			promptRemoveBoxConfirmBtn.onclick = function (){		//点击确认按钮   

				dataAction.deleteDataById(datas,checkedArr);	//删除选中的文件夹
				dataAction.bathchDelete(datas,checkedArr);		//删除选中的文件夹的子文件夹

				wrapList.innerHTML = creatFn.createWrapList(datas,currentId);				//渲染文件夹列表
				pathBox.innerHTML = creatFn.createPathBox(datas,currentId);					//渲染路径栏
				treeMenu.innerHTML = creatFn.createTreeMenu(datas,-1);					//渲染树形菜单
				treeNav = tools.$(".tree-nav")[0];	
				currentTree(currentId)

				mask.style.display = "none";			//隐藏遮罩层
				noClick = false;
				promptRemoveBox.style.display = "none";	//隐藏提示框
				checkedArr = checkedArrFn();			//更新选中的数组
				console.log(checkedArr)
				checkAllOnOff();						//判断全选
				checkAll.state = true;
			}

			promptBoxCancelBtn[0].onclick = function(){			//点击取消按钮
				mask.style.display = "none";			//隐藏遮罩层
				noClick = false;
				promptRemoveBox.style.display = "none";	//隐藏提示框
			}
			
		}else{
			if(promptNoChooseBox.timer)return;				//如果有循环定时器，停止函数
			if(promptNoChooseBox.timer2){					//如果有延迟定时器，清除延迟定时器
				clearTimeout(promptNoChooseBox.timer2);
			}
			promptBoxFn(promptNoChooseBox);					//弹出提示框
		}
		ev.stopPropagation();
	})

	////// 重命名按钮 ////////////////////////// 重命名按钮 ///////////////////////
	var RenameBtn = tools.$("#toolbar-rename-btn");
	var promptOnChangeBox = tools.$("#prompt-on-change-box");	//重命名成功弹出框
	var promptOnChoosesBox = tools.$("#prompt-on-chooses-box");	//选中多个弹出框

	RenameBtn.addEventListener("click",function(ev){		//点击重命名
		var Checkeds = tools.$(".Checked",wrapList);		//获取被选中的文件夹
		if(Checkeds.length === 0){							//如果被选中的数量为0
			if(promptNoChooseBox.timer)return;				//如果有循环定时器，停止函数
			if(promptNoChooseBox.timer2){					//如果有延迟定时器，清除延迟定时器
				clearTimeout(promptNoChooseBox.timer2);
			}
			fullTip("err","请选择文件");				//弹出提示框
		}else if(Checkeds.length === 1){					//如果被选中的数量为1
			
			var folder = Checkeds[0];
			var folderName = tools.$(".folder-name",folder)[0];		//获取到文件名的容器
			var folderInput = tools.$(".folder-input",folder)[0];	//文件名的输入框
			var checkBox = tools.$(".checked",folder)[0];			//选中框
			console.log("input:",folderInput)
			folderName.style.display = "none";		
			folderInput.style.display = "inline-block";	
			folderInput.value = folderName.innerHTML;
			folderInput.focus();
			folderInput.setSelectionRange(0,folderName.innerHTML.length); //设置光标位置
			
			folderInput.addEventListener('click',function(e){
				e.stopPropagation()
			})
			folderInput.addEventListener('mouseup',function(e){
				e.stopPropagation()
			})

			//鼠标按下时的函数
			function fn(ev){
				if(ev.target.nodeName === "INPUT"){
					return;
				}
				folderName.style.display = "block";		//显示标题框
				folderInput.style.display = "none";;		//隐藏输入框
				if(folderInput.value === folderName.innerHTML){		//如果命名等于原命名
					folder.dataset.state = "true";					//取消选中
					tools.removeClass(checkBox,"checked");
					checkBox.style.display = "none";	
					tools.removeClass(folder,"Checked");
				}else if(dataAction.reName(datas,folder.dataset.pid,folderInput.value)){				//如果文件夹重名了
					fullTip("err","文件名有冲突");
					folder.dataset.state = "true";						//取消选中
					tools.removeClass(checkBox,"checked");
					checkBox.style.display = "none";	
					tools.removeClass(folder,"Checked");
				}else{												//如果命名有效
					folderName.innerHTML = folderInput.value;		//更新结构
					folder.dataset.state = "true";							//取消选中
					tools.removeClass(checkBox,"checked");
					checkBox.style.display = "none";	
					tools.removeClass(Checkeds[0],"Checked");

					var curId = folder.dataset.id;				//找到当前文件夹的id
					console.log(curId)
					for (var i = 0; i < datas.length; i++) {	//通过id找到数据
						if(datas[i].id == curId ){
							var curData = datas[i];
						}
					}
					curData.title = folderInput.value;			//修改数据

					wrapList.innerHTML = creatFn.createWrapList(datas,curData.pid);				//渲染文件夹列表
					pathBox.innerHTML = creatFn.createPathBox(datas,curData.pid);					//渲染路径栏
					treeMenu.innerHTML = creatFn.createTreeMenu(datas,-1);					//渲染树形菜单
					currentTree(curData.pid)
					checkAllOnOff();
					fullTip("ok","重命名成功");				//弹出提示框
				}
			}

			document.addEventListener("mousedown",fn,false)
			document.addEventListener("mouseup",function fn2(){
				document.removeEventListener("mousedown",fn,false);
				document.removeEventListener("mouseup",fn2,false);
			},false)
			folderInput.onkeydown = function (ev){						//当enter键按下时
				if(ev.keyCode === 13){
					fn(ev);									//新建文件夹的输入框失去焦点
				}
			}
		}else{		//弹出只能对一个文件夹重命名
			fullTip("err","只能对一个文件夹重命名")
		}
		ev.stopPropagation();
	})

	////// 移动到按钮 ////////////////////////// 移动到按钮 ///////////////////////
	var toolbarMoveBtn = tools.$("#toolbar-move-btn");			//移动到按钮
	var promptMoveBox = tools.$("#prompt-move-box");			//移动到弹出框
	var movaTreeMenuHeader = tools.$(".mova-tree-menu-header")[0];
	var promptMoveBoxConfirmBtn = tools.$(".prompt-move-box-confirm-btn")[0];	//确认按钮
	var movaTreeMenuList = tools.$(".mova-tree-menu-list-box")[0];
	var currentMovaFolder = tools.$(".current-folder")[0];
	var moveTip = tools.$(".tip",promptMoveBox)[0];
	
	toolbarMoveBtn.addEventListener("click",function (ev){
		var Checkeds = tools.$(".Checked",wrapList);		//获取被选中的文件夹
		if(Checkeds.length === 0){							//如果被选中的数量为0
			if(promptNoChooseBox.timer)return;				//如果有循环定时器，停止函数
			if(promptNoChooseBox.timer2){					//如果有延迟定时器，清除延迟定时器
				clearTimeout(promptNoChooseBox.timer2);
			}
			promptBoxFn(promptNoChooseBox);					//弹出提示框
		}else {					
			mask.style.display = "block";			//显示遮罩层
			noClick = true;
			promptMoveBox.style.display = "block";	//显示提示框
			movaTreeMenuList.innerHTML = treeMenu.innerHTML;		//树形菜单放进去
			var folderName = tools.$(".folder-name",Checkeds[0])	//获取到选中的第一个文件夹的名字
			currentMovaFolder.innerHTML = '<i class="ico"></i>'+folderName[folderName.length-1].innerHTML + '<span class="current-folder-length"></span>'; //赋值给结构

			if(Checkeds.length > 1){				//如果被选中的文件夹大于1
				var currentFolderLength = tools.$(".current-folder-length")[0];	//被移动文件夹的数量
				currentFolderLength.innerHTML = "等"+Checkeds.length+"个文件"
			}

			var targetId = null;

			movaTreeMenuList.addEventListener("click", function (ev) {
				
				var movaTreeTitle = tools.parents(ev.target,".tree-title");
				var movaFloderName = tools.$(".ellipsis",movaTreeTitle)[0];
				
				movaTreeMenuHeader.innerHTML = "移动到："+movaFloderName.innerHTML;
				
				var movaTreeTitleId = movaTreeTitle.dataset.id;			//目标文件夹的id
				console.log(movaTreeTitleId)
				var currentPath = tools.$(".currennt-path")[0];			//获取到当前路径
				var currentPid = currentPath.dataset.id;				//获取到当前路径的id为选中文件夹的父id

				treeNav = tools.$(".tree-nav")[0];
				//currentTree(movaTreeTitleId,movaTreeMenuList)
				checkedArr = checkedArrFn();	//获取被选中的id

				var childs = [];

				for (var i = 0; i < checkedArr.length; i++) {
					childs = childs.concat(dataAction.getChildsAll(datas,checkedArr[i]));
				}

				if(movaTreeTitleId === currentPid){			//如果被点击的id等于当前父id
					moveTip.innerHTML = "文件已经在该文件夹下了";
					promptMoveBoxConfirmBtn.state = false;
				}else{
					for (var i = 0; i < childs.length; i++) {		//如果点击的id等于当前选中的id其中一个
						if(childs[i].id == movaTreeTitleId ){
							moveTip.innerHTML = "不能将文件移动到自身或其子文件夹下";
							promptMoveBoxConfirmBtn.state = false;
							break;
						}else {
							targetId = movaTreeTitleId;
							moveTip.innerHTML = "";
							promptMoveBoxConfirmBtn.state = true;
						}
					}
				}
				ev.stopPropagation();
			},false)

			promptMoveBoxConfirmBtn.onclick = function (){		//点击确认按钮
				if(this.state){
					var currentPath = tools.$(".currennt-path")[0];			//获取到当前路径
					var currentPid = currentPath.dataset.id;				//获取到当前路径的id为选中文件夹的父id
					
					for (var i = 0; i < datas.length; i++) {
						for (var j = 0; j < checkedArr.length; j++) {
							if(datas[i].id == checkedArr[j]){
								datas[i].pid =  targetId;
							}
						}
					}
	
					wrapList.innerHTML = creatFn.createWrapList(datas,currentPid);				//渲染文件夹列表
					pathBox.innerHTML = creatFn.createPathBox(datas,currentPid);					//渲染路径栏
					treeMenu.innerHTML = creatFn.createTreeMenu(datas,-1);					//渲染树形菜单
					treeNav = tools.$(".tree-nav")[0];
					currentTree(currentPid)
	
					mask.style.display = "none";			//隐藏遮罩层
					noClick = false;
					promptMoveBox.style.display = "none";	//隐藏提示框
				}
				ev.stopPropagation();
			}

			promptBoxCancelBtn[1].onclick = function(){			//点击取消按钮
				mask.style.display = "none";			//隐藏遮罩层
				noClick = false;
				promptMoveBox.style.display = "none";	//隐藏提示框
				ev.stopPropagation();
			}
		}
		ev.stopPropagation();
	},false)

	////// 拖动 ////////////////////////// 拖动 ///////////////////////

	var shadow = null;
	
	var meetObj = null;

	function moveFileFn(ev){
		var files = tools.$(".folder",wrapList);	//获取到所有的文件夹
		var checkboxs = tools.$(".check-box",wrapList);
		var checkedArr = checkedArrFn();
        if( Math.abs(ev.clientX - beginX) > 10 ||  Math.abs(ev.clientY - beginY) > 10 ){
            if(!shadow){	//如果没有虚影
                shadow = creatFn.moveFileShadow();	//生成虚影
                document.body.appendChild(shadow);
                shadow.style.display = 'block';		//虚影显示
                tips = document.createElement("div");
                tips.style.cssText = 'width:30px;height: 30px;position:absolute;left:0;top:0;'
                document.body.appendChild(tips);
                
            }
            isDrag = true;		//正在拖拽

            tips.style.left = ev.clientX + 'px';
            tips.style.top = ev.clientY + 'px';

            shadow.style.left = ev.clientX+5 + 'px';
            shadow.style.top = ev.clientY+5 + 'px';

            if( shadowTarget.dataset.state === "true"){  	//如果目标文件夹没有被选
            	for (var i = 0; i < files.length; i++) {
            		tools.removeClass(files[i],"Checked");
            		tools.removeClass(checkboxs[i],"checked");
            		files[i].dataset.state = "true";
            		checkboxs[i].style.display = "none";
            	}
                tools.addClass(shadowTarget,"Checked");		//选中目标文件夹
                var checkBox = tools.$(".check-box",shadowTarget)[0];
                if(checkBox){									//如果有选项框
                	checkBox.style.display = "block";			//显示选项框
                }
                tools.addClass(checkBox,"checked");
            	shadowTarget.dataset.state = "";
            }
            //计数
            var sum = tools.$(".sum",shadow)[0];
            var icons = tools.$(".icons",shadow)[0];
            sum.innerHTML = checkedArr.length;
            var str = '';
            var len = checkedArr.length > 4 ? 4 : checkedArr.length;

            for( var i = 0; i < len; i++ ){
                str += '<i class="icon icon'+i+' filetype icon-folder"></i> '
                console.log("xixix")
            }

            icons.innerHTML = str;

            meetObj = null;

            //碰撞检测
			console.log(checkedArr)
            for( var i = 0; i < files.length; i++ ){
                //要碰撞的元素是否存在于被选中的数组中
                if(!indexOf(checkedArr,files[i]) && tools.duang(tips,files[i])  ){
                    files[i].style.background = "skyblue";
                    meetObj = files[i];
                    wrapList.mouseoverState = false;
                }else{
                    files[i].style.background = "";
                    wrapList.mouseoverState = true;
                }
            }
        }     
    }

    function indexOf(arr,item){
        for( var i = 0; i < arr.length; i++ ){
            if( arr[i] === item.dataset.id ){
            return true;
            }
        }  

        return false;
    }

    function upFileFn(){
    	document.removeEventListener("mousemove",moveFileFn,false)
    	document.removeEventListener("mouseup",upFileFn,false)
        if( shadow ){
            document.body.removeChild(shadow);
            document.body.removeChild(tips);
            shadow = null;
        }   
        //如果被碰上的元素存在
        //1 .把选中的元素对应的数据的pid变成被碰上的元素对应的id
        //2 
        if( meetObj ){
                var moveId = meetObj.dataset.id;
                var checkedArr = checkedArrFn();

                var childsTitle = dataAction.getChildsById(datas,moveId);
                var a = true;
                b:for( var i = 0; i < checkedArr.length; i++ ){
                    a = true;
                    var getData = dataAction.getDataById(datas,checkedArr[i]);         //要移动的数据，不能存在于被移入的数据的子数据中 

                    for( var j = 0; j < childsTitle.length; j++ ){		//判断的依据是数据的 title
                        if( childsTitle[j].title == getData.title ){
                            fullTip("warn","部分移动失败,重名了");
                            a = false;
                           //continue b;
                            break;
                        }
                    }

                    if( a ){
                        getData.pid = moveId;
                    }  
                }
                var currentPath = tools.$(".currennt-path")[0];		//找到当前路径
				var currentId = currentPath.dataset.id;		
                wrapList.innerHTML = creatFn.createWrapList(datas,currentId);				//渲染文件夹列表
				pathBox.innerHTML = creatFn.createPathBox(datas,currentId);					//渲染路径栏
				treeMenu.innerHTML = creatFn.createTreeMenu(datas,-1);	
				currentTree(currentId);
                meetObj = null;
        }else{

        }

        isDrag  = false; 
    }

	//生成自由选框的函数
	function selectionBoxFn(ev){
		if(!noClick){
			if(Math.abs(ev.clientX - beginX) > 20 || Math.abs(ev.clientY - beginY) > 20){   //鼠标的移动距离超过了20
		
				if(!selectionBox){		//如果没有自由选框的话
					selectionBox = document.createElement("div"); //创建自由选框
					selectionBox.className = "selectionBox";	//给它命名
					document.body.appendChild(selectionBox);	//放入body的最后
				}
		
				selectionBox.style.width = Math.abs(ev.clientX - beginX) + "px";
				selectionBox.style.height = Math.abs(ev.clientY - beginY) + "px";
				selectionBox.style.left = Math.min(beginX,ev.clientX) + "px";
				selectionBox.style.top = Math.min(beginY,ev.clientY) + "px";
		
				for (var i = 0; i < files.length; i++) {
					var checkBox = tools.$(".check-box",files[i])[0];			//获取每一个选项框
					if(tools.duang(selectionBox,files[i])){
						checkBox.style.display = "block";					
						tools.addClass(checkBox,"checked");						//选中文件夹
						files[i].dataset.state = "";
						tools.addClass(files[i],"Checked");
					}else {
						checkBox.style.display = "none";
						tools.removeClass(checkBox,"checked");
						files[i].dataset.state = "true";
						tools.removeClass(files[i],"Checked");
                     	tools.removeClass(files[i],"mouseover")
					}
				}
		
				checkAllOnOff();
				checkedArr = checkedArrFn();
				console.log(checkedArr)
			}
			ev.preventDefault();				//清除浏览器的默认行为
		}
	}
	
	},false)
	
	
	
	
	//////////////	判断全选的函数	///////////
	function checkAllOnOff (){
		var folders =  tools.$("li",wrapList);				//获取所有的文件夹
		var Checkeds = tools.$(".Checked",wrapList);		//获取被选中的文件夹
		if(folders.length === Checkeds.length){				//如果两者数量相等
			tools.addClass(checkAll,"checkAll-checked");	//全选被选中
			checkAll.state = false;
		}else {
			tools.removeClass(checkAll,"checkAll-checked");	//否则全选未被选中
			checkAll.state = true;
		}
		if(folders.length === 0){							//当文件夹数量为0时，全选不可选
			tools.removeClass(checkAll,"checkAll-checked");	//否则全选未被选中
			checkAll.state = true;
			checkAll.onclick = null;
		}
	}
	//////////////	更新储存选中文件夹id的数组的函数	///////////
	function checkedArrFn(){
		var Checkeds = tools.$(".Checked",wrapList);		//获取被选中的文件夹
		var arr = [];
		for (var i = 0; i < Checkeds.length; i++) {
			arr.push(Checkeds[i].dataset.id);
		}
		return arr;
	}
	/////////////	找到树形菜单中对应的元素的函数	///////////////////////////////////
	function getTreeById(className,id,target){
		var classElement = tools.$("."+className,target);

		for (var i = 0; i < classElement.length; i++) {
			if(classElement[i].dataset.id == id){
				var treeEle = classElement[i];
			}
		}
		return treeEle;
	}
	/////////////	树形菜单与id联动	///////////////////////////////////
	function currentTree(id,target){
		var treeEle = getTreeById("tree-title",id,target)
			tools.addClass(treeEle,"tree-nav");
			tools.removeClass(treeNav,"tree-nav");
			treeNav = treeEle;	
	}
	/////////////	弹出提示框的函数	///////////////////////////////////
	function promptBoxFn(ele){
		ele.style.display = "block";
		ele.style.left = tools.view().W/2 - ele.offsetWidth/2 + "px";
		ele.style.top = "-32px";
		ele.top = -32;
		ele.timer = setInterval(function (){
			ele.top += 1 ;
			ele.style.top = ele.top + "px";
			if(ele.top === 0){
				clearInterval(ele.timer);
				ele.timer = null;
				ele.timer2 = setTimeout(function (){
					ele.style.display = "none";
				},1000)
			}
		})
	}
	/////////////  提示框 	///////////////////////////////////
    var fullTipBox = tools.$(".full-tip-box")[0];
    var fullText = tools.$(".text",fullTipBox)[0];
    function fullTip(classNames,message){

        //先瞬间拉回到-32，在运动到0
        fullTipBox.style.transition = "none";
        fullTipBox.style.top = "-32px";
        
        setTimeout(function (){
           tools.addClass(fullTipBox,classNames);
            fullTipBox.style.transition = ".3s";
            fullTipBox.style.top = 0;     
        },0);

        fullText.innerHTML = message;
        clearTimeout(fullTipBox.timer);
        fullTipBox.timer = setTimeout(function (){
            tools.removeClass(fullTipBox,classNames);
            fullTipBox.style.top = "-32px";   
        },2000);
    }


})()


 

