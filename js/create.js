var creatFn = (function (){
return {
	/////////////	根据数据生成文件夹结构的函数	////////////////////////////////
	createFolder: function (item){			//真文件夹
		/* item 文件夹数据对象*/
		var html = "";
		html = '<li class="folder Fl" data-id="'
			+item.id+'" data-state="true" data-pid="'
			+item.pid+'"><span class="check-box"></span><div class="folder-img"></div><p class="folder-name-box"><em class="folder-name">'
			+item.title
			+'</em><input class="folder-input none" type="text"></p></li>';
		return html;
	},

/////////////	生成页面结构的函数	////////////////////////////////
	createWrapList: function (data,initId){
		/*data 数据组  initId 初始化id*/
		var html = "";	
		var childs = dataAction.getChildsById(data,initId);	//获取到子级数据
		for (var i = 0; i < childs.length; i++) {				//生成子级结构
			html += creatFn.createFolder(childs[i]);
		}
		return html;
	},

/////////////	生成新建文件夹结构的函数	////////////////////////////////////
	createNewFolder: function (pid){
		/* pid 父级的id，在父级下新建文件夹*/
		var newFolder = document.createElement("li");		
		newFolder.className = "folder Fl";
		newFolder.dataset.id = new Date().getTime();
		newFolder.dataset.state = "true";
		newFolder.dataset.pid = pid;
		newFolder.innerHTML = '<div class="folder-img"></div><p class="folder-name-box"><em class="folder-name"></em><input class="folder-input" type="text"></p>'
		return newFolder;
	},

//////////////	生成checkbox结构的函数	/////////////////////////////////
	createNewCheckBox: function (){
		var newCheckBox = document.createElement("span");
		newCheckBox.className = "check-box";
		return newCheckBox;
	},

/////////////	生成路径栏结构的函数	///////////////////////////////////
	createPathBox: function (data,id){
		var parents = dataAction.getParentsById(data,id);		//找到当前文件夹所有的祖先级
		parents.reverse();		//颠倒顺序
		var html = "";
		var zIndex = parents.length + 10;	//声明当前路径的层级，为最高层级

		for (var i = 0; i < parents.length-1; i++) {	//拼写结构
			html += '<a href="javascript:;" class="pathBox clearFix" style="z-index:'+
			zIndex-- +'"><span class="path"  data-id="'
			+parents[i].id+'">'+parents[i].title+'</span> </a>';
		}
		html += '<span class="pathBox clearFix"style="z-index:2"><span class="path  currennt-path" data-id="'
		+parents[parents.length-1].id+'">'+parents[parents.length-1].title+'</span> </span>';

		return html;
	},

	/////////////	生成树形菜单的函数	///////////////////////////////////
	createTreeMenu: function (data,id){
			var treeChilds = dataAction.getChildsById(data,id);	//获取到子级数据
			var  html = '<ul>';										//拼接结构
				for (var i = 0; i < treeChilds.length; i++) {
					var level = dataAction.getLevel(data,id);		//获取到当前数据的层级

					var treeNav = id === -1 ? "tree-nav" : "";		//当id为-1时，添加class tree-nav
					var hasChild = dataAction.hasChilds(data,treeChilds[i].id);
					
					var treeContro = hasChild ? "tree-contro" : "tree-contro-none";
					
					html +='<li>'
				         +'<div class="tree-title '+treeContro+' '+treeNav+'" style="padding-left:'+level*14+'px" data-id="'+treeChilds[i].id+'">'
				         +'<span>'
				         +'<strong class="ellipsis">'+treeChilds[i].title+'</strong>'
				         +'<i class="ico"></i>'
				         +'</span>'
				         +'</div>'
				    html += creatFn.createTreeMenu(data,treeChilds[i].id);
				    html += '</li>'
				}
		    html +='</ul>';
		    return html;
	},

	//拖拽文件夹时的虚影
        moveFileShadow:function (){
            var newDiv = document.createElement("div");
            newDiv.className = 'drag-helper ui-draggable-dragging';

            var html = '<div class="icons">'
                            +'<i class="icon icon0 filetype icon-folder"></i>'  
                        +'</div>'
                        +'<span class="sum">1</span>';

            newDiv.innerHTML = html;
            return newDiv;
        }

	




}
})()