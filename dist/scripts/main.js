function trimSpace(e){for(var t=0;t<e.childNodes.length;t++){var o=e.childNodes[t];3!=o.nodeType||/\S/.test(o.nodeValue)||e.removeChild(o)}}function movePopover(e){hidePopoverTimeout&&(window.clearTimeout(hidePopoverTimeout),hidePopoverTimeout=0);var t=spring.getCurrentValue();t=mapValueFromRangeToRange(t,0,-1,1,.5),1!=t&&scale(e,1);var o=$(e),n=o.offset();lapin.show(),canard.show(),lapin.offset({top:n.top-lapin.outerHeight()-10,left:n.left+touchpointWidth/2-lapin.outerWidth()/2}),canard.offset({top:n.top+touchpointHeight+10,left:n.left+touchpointWidth/2-canard.outerWidth()/2}),lapin.addClass("in"),canard.addClass("in"),1!=t&&scale(e,t)}function hidePopover(){lapin.removeClass("in"),canard.removeClass("in"),hidePopoverTimeout=window.setTimeout(function(){lapin.hide(),canard.hide(),lastSelectedTouchpoint=null},300)}function addTouchpointListeners(e){e.addEventListener("click",function(){0!==closeDelay&&(window.clearTimeout(closeDelay),closeDelay=0),lastSelectedTouchpoint=e,movePopover(e)})}console.log("'Allo 'Allo!"),window.createSpring=function(e,t,o,n){var i,a=e.createSpring();return i=n?new rebound.SpringConfig(t,o):rebound.SpringConfig.fromOrigamiTensionAndFriction(t,o),a.setSpringConfig(i),a.setCurrentValue(0),a};var springSystem=new rebound.SpringSystem,spring=createSpring(springSystem,40,3);window.mapValueFromRangeToRange=function(e,t,o,n,i){return fromRangeSize=o-t,toRangeSize=i-n,valueScale=(e-t)/fromRangeSize,n+valueScale*toRangeSize},window.scale=function(e,t){if(v="translate3d(0,0,0)",t>.99&&1.01>t||(v+=" scale3d("+t+", "+t+", 1)"),e.style.transform!=v){if(e.style.mozTransform=e.style.msTransform=e.style.webkitTransform=e.style.transform=v,t>.99&&1.01>t)return canard[0].style.transform="translate3d(0,0,0)",void(lapin[0].style.transform="translate3d(0,0,0)");var o=t,n=canard.outerHeight()+10,i=touchpointHeight*(1-t)*.5,a=(n+10)*(1-t)*-.5-i;v="translate3d(0,"+a+"px,0) scale3d("+o+", "+o+", 1)",canard[0].style.transform=v,n=lapin.outerHeight()+10,a=n*(1-t)*.5+i,v="translate3d(0,"+a+"px,0) scale3d("+o+", "+o+", 1)",lapin[0].style.transform=v}};var item=null,secondItem=null;spring.setCurrentValue(-1),spring.addListener({el:null,onSpringUpdate:function(e){if(item){var t=e.getCurrentValue();t=mapValueFromRangeToRange(t,0,-1,1,.5),scale(item,t),null!=secondItem&&scale(secondItem,t)}}});var el=document.getElementById("main-touchpoints");trimSpace(el);var closeDelay=0,lapin=$(".popover:first"),canard=$(".popover:last"),uselessTouchpoint=$(".visual-touchpoint:first"),touchpointWidth=uselessTouchpoint.outerWidth(),touchpointHeight=uselessTouchpoint.outerHeight(),hidePopoverTimeout=0;$(document).click(function(e){(!e.target.classList.contains("visual-touchpoint")||e.target.classList.contains("visual-touchpoint-template"))&&hidePopover()});for(var lastSelectedTouchpoint=null,i=0,t=el.getElementsByClassName("visual-touchpoint"),l=t.length;l>i;++i)addTouchpointListeners(t[i]);$(window).resize(function(){lastSelectedTouchpoint&&movePopover(lastSelectedTouchpoint)});var roger=null;new Sortable(el,{group:"canard",draggable:".visual-touchpoint",onAdd:function(e){console.log("aaad?",e.item),e.item.classList.remove("visual-touchpoint-template"),addTouchpointListeners(e.item)},onUpdate:function(){hasBeenUpdated=!0},onStart:function(e){e.item!==item&&item&&scale(item,1),item=null,secondItem=null,spring.setEndValue(-1),$(".visual-touchpoint").not(e.item).popover("hide"),closeDelay=window.setTimeout(function(){lapin.removeClass("in"),canard.removeClass("in"),closeDelay=0},100),roger.options.group="laaaaaapin"},onEnd:function(e){item=e.item,spring.setEndValue(0),roger.options.group="canard"}});var parentTool=null;roger=new Sortable(document.getElementsByClassName("tool")[0],{group:"canard",onAdd:function(e){console.log("AAAAAD",e.item)},onRemove:function(e){console.log("REMOVEEEE",e.item);var t=e.item.cloneNode(!0);parentTool.appendChild(t),secondItem=t},onStart:function(e){e.item!==item&&item&&scale(item,1),item=null,secondItem=null,parentTool=e.item.parentNode,hidePopover(),spring.setEndValue(-1)},onEnd:function(e){item=e.item,spring.setEndValue(0)}}),$("button.popover-btn").click(function(){if(!item)return void console.log("todo see");var e=document.getElementsByClassName("visual-touchpoint-template");return this.classList.contains("popover-actor-btn")?(item.style.borderColor=this.style.background,void(e.length&&(e[0].style.borderColor=this.style.background))):(item.className=this.firstChild.className,void(e.length&&(e[0].className=item.className+" visual-touchpoint-template")))});