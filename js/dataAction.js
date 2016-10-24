//处理数据的文件
var dataAction = (function(data,id){
	return {
		getChildsById:function (data,id){   //通过id'找到子级数据
		/*
			参数：
			data: 总数据
			id：某个文件的id
			返回值：
				类型：Array
				内容：子数据的集合
		*/
			var arr = [];				//声明空数组存放所需数据
			for (var i = 0; i < data.length; i++) {	
				if(data[i].pid == id){		//根据父级id找到所需数据
					arr.push(data[i]);			//把数据放入arr
				}
			}
			return arr;
		},


		/* 通过指定的id ，找到这个id所在元素及所有的祖先元素的数据*/
		getParentsById : function (data,id){
			/*
				参数： 
					data：总数据
					id：指定元素的id
				返回值： 
					类型：Array
					内容：指定元素及所有祖先元素的数据
			*/
			var arr = [];
			
			for (var i = 0; i < data.length; i++) {	//循环所有id
				if(data[i].id == id){			//如果数据中某一个数据的id == 当前元素的id 则为当前元素的数据
					arr.push(data[i])
					arr = arr.concat(dataAction.getParentsById(data,data[i].pid)) 				//重复调用函数
				}
			}
			return arr;
		},

		//获取当前数据的
		getLevel: function (data,id){
			return dataAction.getParentsById(data,id).length;
		},

		//判断指定id下有没有子级
		hasChilds: function(data,id){
			return !!dataAction.getChildsById(data,id).length;
		},

		//判断同级中重名的id
		reName: function (data,pid,title){
			var childs = dataAction.getChildsById(data,pid);

			for (var i = childs.length - 1; i >= 0; i--) {
				if(childs[i].title === title){
					return true;
				}
			}

			return false;
		},

		//批量删除的函数
		deleteDataById:function (data,idArr){
	    	for( var i = 0; i < data.length; i++ ){
	    		for( var j = 0; j < idArr.length; j++ ){
	    			if( data[i].id == idArr[j] ){
	    				data.splice(i,1);
	    				i--;
	    				break;
	    			}
	    		}
	    	}	
	    },

		//找到指定id下所有的子孙数据
		getChildsAll:function (datas,id){
            //通过循环数据，找到指定id的那条数据
            var arr = [];
            for( var i = 0; i < datas.length; i++ ){
                if( datas[i].id == id ){
                    arr.push(datas[i]);
                    var childs = dataAction.getChildsById(datas,datas[i].id);

                    for( var j = 0; j < childs.length; j++ ){
                       arr = arr.concat(dataAction.getChildsAll(datas,childs[j].id));
                    }
                }
            }

            return arr;    
        },

		//删除指定id下所有的子级
		bathchDelete:function (data,idArr) {
		 	for (var i = 0; i < idArr.length; i++) {
		 		var childsAll =  dataAction.getChildsAll(data,idArr[i]) ;
		 		for(var j = 0, length2 = childsAll.length; j < length2; j++){
		 			for(var k = 0, length3 = data.length; k < length3; k++){
		 				if(data[k].id == childsAll[j].id){
		 					data.splice(k, 1);
		 					break;
		 				}
		 			}
		 		}
		 	}
		},
        getDataById:function (datas,id){
        	for( var i = 0; i < datas.length; i++ ){
        		if( datas[i].id == id ){
        			return datas[i];
        		}
        	}

        	return null;
        },
        getParent:function (datas,id){
        	var parents = dataAction.getParentsById(datas,id);

        	return parents[1];
        }
	}
}())