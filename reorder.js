(function(){

new Vue({
  el: '#master-container',
  created: function(){
    this.items = data;   
    for(var i = 0; i < this.items.length; i++){
      this.items[i].top = 0;
      this.items[i].bottom = 0;
    }    
  },
  mounted: function(){
    var items = document.getElementsByClassName('item-container');
    for(var i = 0; i < items.length; i++){
      var myDivStats = items[i].getBoundingClientRect();
      var topAndBottom = this.getPositions(items, i);
      this.items[i].top = topAndBottom.top + 'px';
      this.items[i].bottom = topAndBottom.bottom;
      this.originalTops[i] = this.items[i].top;
      this.originalBottoms[i] = this.items[i].bottom;
    }
    this.setMarginLeft(items[0]);
  }, 
  data: function () {
    return {
      currentlyDragged: -1,
      currentlyHovered: -1,
      verticalMove: 0, 
      currentX: 0, 
      top: 0,
      items: [],
      originalTops: [],
      originalBottoms: [],
      marginLeft: '10px'        
      }
  },
  methods: {
    getPositions: function(items, index){
      var top = 30;
      var bottom = 30 + items[0].scrollHeight;
      for(var i = 0; i < index; i++){
        top += items[index].scrollHeight + 10;
        bottom += items[index].scrollHeight + 10;
      }
      return {top: top, bottom: bottom};
    },
    removePx: function(str){
      var arr = str.split('p');
      return parseInt(arr[0]);
    },    
    moveElement: function(currentlyDragged, currentlyHovered) {
      var tmp = this.items[currentlyDragged];
      this.items.splice(currentlyDragged, 1);
      this.items.splice(currentlyHovered, 0, tmp);
      for(var i = 0; i < this.items.length; i++){
        this.items[i].top = this.originalTops[i];
        this.items[i].bottom = this.originalBottoms[i];
      }     
    },
    setMarginLeft: function(item){
      this.marginLeft = -Math.abs(item.scrollWidth / 2) + 'px';
    },
    onTopOfWhatDiv: function(comparisonPosition, index){
      for(var i = 0; i < this.items.length; i++){
        if(i !== index && this.removePx(this.items[i].top) < comparisonPosition && this.items[i].bottom > comparisonPosition){
          return i;
        }               
      }
      return -1;
    },
    dragMouseDown: function(index, e){
      e = e || window.event;
      this.currentY = e.clientY;
      document.onmouseup = function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
        if(that.currentlyHovered === -1){
          that.currentlyHovered = -1;
          that.currentlyDragged = -1;
          that.$forceUpdate();
          that.items[index].top = that.originalTops[index];
          return;
        } 
        that.moveElement(that.currentlyDragged, that.currentlyHovered); 
        setTimeout(function(){
          that.currentlyHovered = -1;
          that.currentlyDragged = -1;  
        }, 50)            
      };
      // call a function whenever the hoveredDiv cursor moves:
      var that = this;
      document.onmousemove =  function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        that.currentlyDragged = index;
        that.verticalMove = that.currentY - e.clientY;
        that.currentY = e.clientY; // y   
        var mydiv = document.getElementById('item_' + index);             
        var myDivStats = mydiv.getBoundingClientRect();        
        that.items[index].top = (mydiv.offsetTop - that.verticalMove) + "px";  
        that.$forceUpdate();
        that.currentlyHovered = that.onTopOfWhatDiv(that.MovingUp ? myDivStats.top : myDivStats.bottom, index);
      };      
    }    

  },
  computed: {
     MovingUp: function(){
       return this.verticalMove > 0
     }    
  }
})


}());


