function e(id_name) {
  return document.getElementById(id_name);
}

// this function from Douglas Crockford (www.crockford.com)
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

// traverses up nodes, looking for a node called targetNodeName
function findNode(target, targetNodeName, stopAt) {
  if(target.nodeName == targetNodeName) {
    return target;
  } else if(target.nodeName == stopAt) {
    return false;
  } else {
    return findNode(target.parentNode, targetNodeName, stopAt);
  }
}

function hide(e) {
  e.style.display = 'none';
}
function show(e) {
  e.style.display = '';
}

function toggleVisibility(e) {
  e.style.display == '' ? hide(e) : show(e);
}

// when user clicks on trigger, the visibilities of eA and eB are toggled
function toggleElements(trigger, eA, eB) {
  show(eA);
  hide(eB);
  trigger.onclick = function() {
    toggleVisibility(eA);
    toggleVisibility(eB);
  };
}

// toggles the class of obj between classA and classB
function toggleObjectClass(obj, classA, classB) {
  obj.className = (obj.className == classA) ? classB : classA;
}

function getEvent(nsEvent) {
  return nsEvent || window.event;
}

function getTarget(event) {
  return event.target || event.srcElement;
}

// returns the event's target object
function targetObject(nsEvent) {
  var theEvent = nsEvent || window.event;
  var theTarget = theEvent.target || theEvent.srcElement;
  return theTarget;
}
