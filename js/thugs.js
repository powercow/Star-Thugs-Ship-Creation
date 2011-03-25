function system(args) {
	this.name = args.name;
	this.price = args.price;
	this.damage = args.damage;
	this.hp = args.hp;
	this.dr = args.dr;
	this.special = args.special;
	this.type = args.type;
	this.modify = args.modify;
	this.unmodify = args.unmodify;
	this.specialNum = args.specialNum;
	this.specialNum2 = args.specialNum2;
	this.additionalDisplay = args.additionalDisplay;
	this.additionalNumber = args.additionalNumber;
	this.display = function(multi) 
	{
		var pants = "";
		if(multi==1)
		{
			pants+="<b>Name:</b> "+this.name+"<br/>";
		}
		else if(multi==2)
		{
			pants+="<b>Name:</b> Heavy "+this.name+"<br/>";
		}
		else
		{
			pants+="<b>Name:</b> Super Heavy "+this.name+"<br/>";
		}
		pants+="<b>Price:</b> $"+this.price*multi+"<br/>";
		if(this.damage>0)
		{
			pants+="<b>Damage:</b> D"+this.damage*multi+"<br/>";
		}	
		if(this.hp>0)
		{
			pants+="<b>HP:</b> "+this.hp*multi+"<br/>";
		}
		if(this.dr>0)
		{
			pants+="<b>DR:</b> "+this.dr*multi+"<br/>";
		}
		if(this.special!=undefined)
		{
			var displayString = this.special;
			if(this.specialNum!=undefined)
			{
				displayString = displayString.replace("%s", this.specialNum*multi);
			}	
			if(this.specialNum2!=undefined)
			{
				displayString = displayString.replace("%t", this.specialNum2*multi);
			}				
			pants+=displayString+"<br/>";
		}
		if(this.additionalDisplay!=undefined)
		{
			var displayString = this.additionalDisplay;
			if(this.additionalNumber!=undefined)
			{
				displayString=this.additionalDisplay.replace("%s", this.additionalNumber*multi);
			}
			else
			{
				displayString=this.additionalDisplay;
			}
			pants+=displayString;
		}
		return pants;
	}
}

function ship()
{
	this.frontSlots = 0;
	this.outerSlots = 0;
	this.leftSlots = 0;
	this.rightSlots = 0;
	this.coreSlots = 0;
	this.rearSlots = 0;
	this.totalSlots = 0;
	this.thrust = 0;
	this.totalCost = 0;
	this.shields = 0;
	this.shieldRegen = 0;
	this.cargo = 0;
	this.crew = 0;
	this.calculateSpeed = function()
	{
		return Math.ceil(this.thrust/this.calculateSize());
	}
	this.calculateDefense = function()
	{
		return (this.calculateSpeed() - this.calculateSize());
	}
	this.calculateSize = function()
	{
		var size = Math.ceil(this.totalSlots/5);
		if(size>8)
		{
			size = Math.ceil(Math.ceil(((this.totalSlots - 40)/10))+8);
		}
		return size;
	}
	this.calculateBaseCrew = function()
	{
		return (this.calculateSize() + 2);
	}
	this.calculateBaseCargo = function()
	{
		return (this.calculateSize());
	}
	this.addSlot = function(type, multi)
	{
		this.totalSlots=this.totalSlots+multi;
		if(type=='front')
		{
			this.frontSlots=this.frontSlots+multi;
		}
		else if(type=='outer')
		{
			this.outerSlots=this.outerSlots+multi;
		}
		else if(type=='left')
		{
			this.leftSlots=this.leftSlots+multi;;
		}
		else if(type=='right')
		{
			this.rightSlots=this.rightSlots+multi;
		}
		else if(type=='core')
		{
			this.coreSlots=this.coreSlots+multi;
		}
		else if(type=='rear')
		{
			this.rearSlots=this.rearSlots+multi;
		}
	}
	this.removeSlot = function(type, multi)
	{
		this.totalSlots=this.totalSlots-multi;
		if(type=='front')
		{
			this.frontSlots=this.frontSlots-multi;
		}
		else if(type=='outer')
		{
			this.outerSlots=this.outerSlots-multi;
		}
		else if(type=='left')
		{
			this.leftSlots=this.leftSlots-multi;;
		}
		else if(type=='right')
		{
			this.rightSlots=this.rightSlots-multi;
		}
		else if(type=='core')
		{
			this.coreSlots=this.coreSlots-multi;
		}
		else if(type=='rear')
		{
			this.rearSlots=this.rearSlots-multi;
		}
	}
}

function missile(args)
{
	this.name = args.name;
	this.price = args.price;
	this.toHit = args.toHit;
	this.damage = args.damage;
	this.special = args.special;
}

var ship = new ship();

var oldSizeValue = null;
var i = 0;

var types = new Array();
types[0]="Universal";
types[1]="Armor";
types[2]="Cargo";
types[3]="Weapon";
types[4]="Shield";
types[5]="Engine";

var typeCosts = new Array();
typeCosts["Universal"]=1000;
typeCosts["Armor"]=0;
typeCosts["Cargo"]=0;
typeCosts["Weapon"]=500;
typeCosts["Shield"]=500;
typeCosts["Engine"]=500;

var oldValues = new Array();
var oldMissileValues = new Array();

var systems = new Array();
systems[0]=new system({type:"Weapon", name:"10 MW Laser Cannon", price:1000, damage:3, hp:8, special:"Sustained Fire %s", specialNum:1});
systems[1]=new system({type:"Weapon", name:"18 MW Laser Cannon", price:2500, damage:5, hp:8, special:"Sustained Fire %s", specialNum:1});
systems[2]=new system({type:"Weapon", name:"Military Laser Cannon", price:8000, damage:10, hp:16, special:"Sustained Fire %s", specialNum:1});
systems[3]=new system({type:"Weapon", name:"20mm Vulcan", price:1800, damage:2, hp:8, special:"3 shots per turn, Ammo max 6"});
systems[4]=new system({type:"Weapon", name:"45mm Vulcan", price:4500, damage:4, hp:8, special:"3 shots per turn, Ammo max 5"});
systems[5]=new system({type:"Weapon", name:"92mm Vulcan", price:8000, damage:7, hp:8, special:"3 shots per turn, Ammo max 4"});
systems[6]=new system({type:"Weapon", name:"20MW Light Plasma Cannon", price:5500, damage:9, hp:8});
systems[7]=new system({type:"Weapon", name:"40MW Plasma Cannon", price:8500, damage:12, hp:10});
systems[8]=new system({type:"Weapon", name:"80MW Military Plasma Cannon", price:18000, damage:18});
systems[9]=new system({type:"Weapon", name:"Ion Rail", price:14000, damage:16, hp:8});
systems[10]=new system({type:"Weapon", name:"Pulse Ion Rail", price:8000, damage:15, hp:8, special:"Fires Every Other Turn"});
systems[11]=new system({type:"Weapon", name:"160mm Howitzer", price:4500, damage:8, hp:6, special:"Ammo max 4"});
systems[12]=new system({type:"Weapon", name:"Rail Gun", price:28000, damage:24, hp:8});
systems[13]=new system({type:"Weapon", name:"Cratermaster Cannon", price:75000, damage:4, hp:4, special:"Inflicts damage on first three systems. Ignores shields and armor DR."});
systems[14]=new system({type:"Weapon", name:"Cratermaster Mk II", price:125000, damage:12, hp:4, special:"Hits target system regardless of intervening systems"});
systems[15]=new system({type:"Weapon", name:"Quasiprotonic Disrupter", price:70000, damage:40, hp:8});
systems[16]=new system({type:"Weapon", name:"Negatizer Beam", price:450000, damage:100, hp:8, special:"Ignores armor DR"});
systems[17]=new system({type:"Weapon", name:"Tether Cable", price:5000, hp:12, special:"-2 to hit. Board at end of turn on successful hit."});
systems[18]=new system({type:"Engine", name:"Generic Thruster", price:1500, hp:6,modify:function(multi){ship.thrust = ship.thrust + 2*multi;}, unmodify:function(multi){ship.thrust = ship.thrust - 2*multi;}, special:"<b>Thrust:</b> %s", specialNum:2});
systems[19]=new system({type:"Engine", name:"Hellforce Taurus", price:3200, hp:10,modify:function(multi){ship.thrust = ship.thrust + 3*multi;},unmodify:function(multi){ship.thrust = ship.thrust - 3*multi;}, special:"<b>Thrust:</b> %s", specialNum:3});
systems[20]=new system({type:"Engine", name:"Hellforce Thunderhead", price:5000, hp:10,modify:function(multi){ship.thrust = ship.thrust + 4*multi;},unmodify:function(multi){ship.thrust = ship.thrust - 4*multi;}, special:"<b>Thrust:</b> %s", specialNum:4});
systems[21]=new system({type:"Engine", name:"Affratron Silverwing", price:7500, hp:4,modify:function(multi){ship.thrust = ship.thrust + 5*multi;},unmodify:function(multi){ship.thrust = ship.thrust - 5*multi;}, special:"<b>Thrust:</b> %s", specialNum:5});
systems[22]=new system({type:"Engine", name:"Affratron Performance Pro", price:10000, hp:6, modify:function(multi){ship.thrust = ship.thrust + 6*multi;},unmodify:function(multi){ship.thrust = ship.thrust - 6*multi;}, special:"<b>Thrust:</b> %s", specialNum:6});
systems[23]=new system({type:"Engine", name:"Affratron Performance Elite", price:20000, hp:6, modify:function(multi){ship.thrust = ship.thrust + 8*multi;},unmodify:function(multi){ship.thrust = ship.thrust - 8*multi;}, special:"<b>Thrust:</b> %s", specialNum:8});
systems[24]=new system({type:"Engine", name:"Affratron-Monicker Laserwing", price:25000, hp:4, modify:function(multi){ship.thrust = ship.thrust + 9*multi;},unmodify:function(multi){ship.thrust = ship.thrust - 9*multi;}, special:"<b>Thrust:</b> %s", specialNum:9});
systems[25]=new system({type:"Armor", name:"Steel Armor", price:300, hp:6});
systems[26]=new system({type:"Armor", name:"Titanium Armor", price:1200, hp:12});
systems[27]=new system({type:"Armor", name:"Kaitrite Armor", price:2500, hp:16});
systems[28]=new system({type:"Armor", name:"Polytitanium Armor", price:9000, hp:24, dr:1});
systems[29]=new system({type:"Armor", name:"FerroChromite Armor", price:9500, hp:20, dr:2});
systems[30]=new system({type:"Armor", name:"Vekati Crystal Armor", price:10000, hp:12, dr:4});
systems[31]=new system({type:"Armor", name:"Battlesteel Armor", price:24000, hp:30, dr:3});
systems[32]=new system({type:"Armor", name:"Nanoarmor", price:100000, hp:30, dr:7, special:"DR %s vs. Laser, Kinetic, Magnetic and Plasma weapons",specialNum:15});
systems[33]=new system({type:"Armor", name:"Minor Nanoarmor", price:15000, hp:8, special:"DR %s vs. Laser, Kinetic, Magnetic and Plasma weapons",specialNum:10});
systems[34]=new system({type:"Armor", name:"Inksteel Armor", price:60000, hp:60, dr:2});
systems[35]=new system({type:"Armor", name:"Plasmaweave Armor", price:160000, hp:50, dr:10});
systems[36]=new system({type:"Armor", name:"Military Plasmaweave", price:500000, hp:80, dr:15});
systems[37]=new system({type:"Armor", name:"Shunt Shield Armor", price:25000000, hp:30, special:"DR Infinite versus non-gravity weapons, ignores armor piercing"});
systems[38]=new system({type:"Armor", name:"Polychromite Armor", price:60000, hp:15, dr:1, special:"DR %s vs. Laser Weapons",specialNum:5});
systems[39]=new system({type:"Armor", name:"Magmasteel Armor", price:10000, hp:18, dr:1, special:"DR %s vs. Plasma Weapons",specialNum:6});
systems[40]=new system({type:"Armor", name:"Blackgel Armor", price:8000, hp:15, special:"DR %s vs. Kinetic and %t vs. Explosive Weapons",specialNum:3, specialNum2:5});
systems[41]=new system({type:"None", price:0, name:"Empty"});

function genShieldModify(max, regen)
{
	return function(multi)
	{
		ship.shields = ship.shields + max*multi;
		ship.shieldRegen = ship.shieldRegen + regen*multi;
	}
}
function genShieldUnmodify(max, regen)
{
	return function(multi)
	{
		ship.shields = ship.shields - max*multi;
		ship.shieldRegen = ship.shieldRegen - regen*multi;
	}
}
systems[43]=new system({type:"Shield", price:3500, name:"Nomi Light Generator", hp:8, modify:genShieldModify(10,1), unmodify:genShieldUnmodify(10,1),special:"<b>Shields:</b> %s <b>Regen:</b> %t",specialNum:10,specialNum2:1});
systems[44]=new system({type:"Shield", price:10000, name:"Mikta Generator", hp:8, modify:genShieldModify(20,2), unmodify:genShieldUnmodify(20,2),special:"<b>Shields:</b> %s <b>Regen:</b> %t",specialNum:20,specialNum2:2});
systems[45]=new system({type:"Shield", name:"Terecta Combat Generator", price:75000, hp:8, modify:genShieldModify(60,4), unmodify:genShieldUnmodify(60,4),special:"<b>Shields:</b> %s <b>Regen:</b> %t",specialNum:60,specialNum2:4});
systems[46]=new system({type:"Shield", name:"Rattica Support Generator", price:6000, hp:8, modify:genShieldModify(0,8), unmodify:genShieldUnmodify(0,8),special:"<b>Shields:</b> %s <b>Regen:</b> %t",specialNum:0,specialNum2:8});
systems[47]=new system({type:"Shield", name:"Mantis Generator", price:7500, hp:8, modify:genShieldModify(16,2), unmodify:genShieldUnmodify(16,2),special:"<b>Shields:</b> %s <b>Regen:</b> %t",specialNum:16,specialNum2:2});
systems[48]=new system({type:"Shield", name:"Griffin Generator", price:40000, hp:8, modify:genShieldModify(40,8), unmodify:genShieldUnmodify(40,8),special:"<b>Shields:</b> %s <b>Regen:</b> %t",specialNum:40,specialNum2:8});
systems[49]=new system({type:"Shield", name:"Hydra Generator", price:145000, hp:8, modify:genShieldModify(80,14), unmodify:genShieldUnmodify(80,14),special:"<b>Shields:</b> %s <b>Regen:</b> %t",specialNum:80,specialNum2:14});
systems[50]=new system({type:"Shield", name:"Firestorm Support Generator", price:27000, hp:8, modify:genShieldModify(0,20), unmodify:genShieldUnmodify(0,20),special:"<b>Shields:</b> %s <b>Regen:</b> %t",specialNum:0,specialNum2:20});
systems[51]=new system({type:"Shield", name:"Military Generator", price:310000, hp:10, modify:genShieldModify(120,20), unmodify:genShieldUnmodify(120,20),special:"<b>Shields:</b> %s <b>Regen:</b> %t",specialNum:120,specialNum2:20});
systems[52]=new system({type:"Cargo", name:"Cargo Bay", price:400, hp:8, modify:function(multi){ship.cargo = ship.cargo + 2*multi;}, unmodify:function(multi){ship.cargo = ship.cargo - 2*multi;}});
systems[53]=new system({type:"Cargo", name:"Autoloading Bay", price:8000, hp:8, modify:function(multi){ship.cargo = ship.cargo + 4*multi;}, unmodify:function(multi){ship.cargo = ship.cargo - 4*multi;}});
systems[54]=new system({type:"Cargo", name:"Armored Cargo Bay", price:10000, hp:16, dr:2, modify:function(multi){ship.cargo = ship.cargo + 2*multi;}, unmodify:function(multi){ship.cargo = ship.cargo - 2*multi;}});
systems[55]=new system({type:"Cargo", name:"Livestock Bay", price:1200, hp:8, modify:function(multi){ship.cargo = ship.cargo + 2*multi;}, unmodify:function(multi){ship.cargo = ship.cargo - 2*multi;}});
systems[56]=new system({type:"Cargo", name:"Refrigeration Bay", price:1200, hp:8, modify:function(multi){ship.cargo = ship.cargo + 2*multi;}, unmodify:function(multi){ship.cargo = ship.cargo - 2*multi;}});
systems[57]=new system({type:"Cargo", name:"Passenger Cabin", price:2000, hp:8, modify:function(multi){ship.crew = ship.crew + 2*multi;}, unmodify:function(multi){ship.crew = ship.crew - 2*multi;}});
systems[58]=new system({type:"Cargo", name:"Bunk Cabin", price:2500, hp:8, modify:function(multi){ship.crew = ship.crew + 3*multi;}, unmodify:function(multi){ship.crew = ship.crew - 3*multi;}});
systems[59]=new system({type:"Cargo", name:"Deluxe Passenger Cabin", price:10000, hp:6, modify:function(multi){ship.crew = ship.crew + 1*multi;}, unmodify:function(multi){ship.crew = ship.crew - 1*multi;}});
systems[42]=new system({type:"Weapon", price:1000, name:"Missile Rack", hp:4, special:"Holds %s missiles", specialNum:3, modify:function(multi, id){createMissileRack(id,3*multi);}});
systems[60]=new system({type:"Weapon", name:"Missile Launcher", price:1500, hp:8, special:"Holds %s missiles", specialNum:4, modify:function(multi, id){createMissileRack(id,4*multi);}});
systems[61]=new system({type:"Weapon", name:"Cyclic Missile Launcher", price:4500, hp:8, special:"Holds %s missiles", specialNum:8, modify:function(multi, id){createMissileRack(id,8*multi);}});
systems[62]=new system({type:"Weapon", name:"Bale Missile Rack", price:5000, hp:8, special:"Holds %s missiles", specialNum:3, modify:function(multi, id){createMissileRack(id,3*multi);}, additionalDisplay:"Fires 3/turn"});
systems[63]=new system({type:"Weapon", name:"Stormcrow Missile Launcher", price:12000, hp:8, special:"Holds %s missiles", specialNum:6, modify:function(multi, id){createMissileRack(id,4*multi);}, additionalDisplay:"Fires 3/round"});

var missiles = new Array();
missiles[0]=new missile({name:"Empty",price:0,toHit:0,damage:0});
missiles[1]=new missile({name:"Hornet",price:150,toHit:5,damage:7});
missiles[2]=new missile({name:"Wasp",price:300,toHit:4,damage:9});
missiles[3]=new missile({name:"Cyclone",price:1000,toHit:2,damage:12});
missiles[4]=new missile({name:"Lance",price:650,toHit:5,damage:16});
missiles[5]=new missile({name:"Typhoon",price:1200,toHit:3,damage:18});
missiles[6]=new missile({name:"Rapier",price:5000,toHit:1,damage:16,special:"bypasses first armor system it hits, ignores up to 15 points of shields"});
missiles[7]=new missile({name:"Medusa Shield Disruptor",price:1000,toHit:5,damage:0,special:"Inflicts 20 damage to shields on facing and 10 damage to shields on adjacent facings"});
missiles[8]=new missile({name:"Hammrhead",price:2000,toHit:8,damage:40});
missiles[9]=new missile({name:"Mace",price:350,toHit:5,damage:8,special:"bypasses first armor system"});
missiles[10]=new missile({name:"Achilles",price:500,toHit:7,damage:8,special:"bypasses non-engine systems, will always hit a facing with an engine"});
missiles[11]=new missile({name:"Police Achilles",price:2000,toHit:4,damage:8,special:"bypasses non-engine systems, will always hit a facing with an engine"});
missiles[12]=new missile({name:"Parasite Tracking",price:1000,toHit:1,damage:0,special:"no damage, emits tracking signal"});
missiles[13]=new missile({name:"MK XII Interceptor",price:3500,toHit:2,damage:26});
missiles[14]=new missile({name:"Guardian Anti-Missile",price:300,toHit:-1,damage:0,special:"Hits incoming missile on roll under incoming missile’s to-hit roll"});
missiles[15]=new missile({name:"Screambat Cluster Pack",price:800,toHit:3,damage:5,special:"Four missiles in pack"});
missiles[16]=new missile({name:"Antimatter Torpedo",price:400,toHit:-1,damage:16,special:"Direct fire, -2 to hit"});
missiles[17]=new missile({name:"Military-Grade",price:15000,toHit:0,damage:30,special:"bypasses first armor system and up to 30 points of shields"});

function populateSlotDropdown(id)
{
	var select = "<select id=\"slotSelect"+id+"\">";
	for(x=0; x<types.length; x++)
	{
		select+="<option value='"+types[x]+"'>"+types[x]+"</option>";
		select+="<option value='"+types[x]+"|||HEAVY'>Heavy "+types[x]+"</option>";
		select+="<option value='"+types[x]+"|||SUPER'>Super Heavy "+types[x]+"</option>";
	}
	select+="</select><a href=\"#\" onclick=\"addSlot('"+id+"');\">add</a> ";
	$("#"+id).append(select);
}

function addSlot(id)
{
	var multi = 1;
	var value = document.getElementById("slotSelect"+id).options[document.getElementById("slotSelect"+id).selectedIndex].value;
	if(value.indexOf("HEAVY")!=-1)
	{	
		value = value.substr(0, value.indexOf("|"));
		multi = 2;
	}
	else if(value.indexOf("SUPER")!=-1)
	{
		value = value.substr(0, value.indexOf("|"));
		multi = 4;
	}		
	var select ="<div id=\"slot"+i+"\" class=\""+value+"\"><span id=\"description"+i+"\" title=\"click to display information\" class=\"description\" onclick=\"populateInformationDiv(document.getElementById('systemSelect"+i+"').options[document.getElementById('systemSelect"+i+"').selectedIndex].value, ";	
	select+=multi+"); openMissileDivs("+i+");\"><b>";
	if(multi>2)
	{
		select+="Super ";
	}
	else if(multi>1)
	{
		select+="Heavy ";
	}
	select+=value+" Slot:</b></span>";
	if(id=="core" && !canAddCore())
	{
		alert("You cannot have more core slots than you have slots in front, left, right, or rear");
		return false;
	}	
	if(id=="outer" && !canAddOuter())
	{
		alert("You cannot have more outer slots than you have slots in front, left, right, or rear");
		return false;
	}
	select += "<select id=\"systemSelect"+i+"\" onchange=\"onSlotChange('"+i+"');\"><option value=\"41\">EMPTY</option>";
	for(x=0; x<systems.length; x++)
	{
		if(systems[x].type==value)
		{
			select+="<option value='"+x+"'>"+systems[x].name+"</option>";
		}
	}
	select+="</select><a href=\"#\" onClick=\"removeSlot("+i+");\">remove</a></div>";
	$("#"+id).append(select);
	i++;
	ship.totalCost = ship.totalCost + typeCosts[value]*multi;		
	ship.totalCost = ship.totalCost - calculateSizeValue(ship.calculateSize());
	ship.addSlot(id, multi);
	ship.totalCost=ship.totalCost+calculateSizeValue(ship.calculateSize());
	document.getElementById("totalcostDiv").innerHTML = "$"+ship.totalCost;
	populateShipInfo();
}

function removeSlot(id)
{
	removeMissileRack(id);
	var multi = getSlotSize(id);
	var value = document.getElementById("systemSelect"+id).options[document.getElementById("systemSelect"+id).selectedIndex].value;
	var select ="";	
	ship.totalCost=ship.totalCost-calculateSizeValue(ship.calculateSize());
	ship.totalCost = ship.totalCost - typeCosts[$("#slot"+id)[0].className]*multi;
	ship.totalCost = ship.totalCost - systems[value].price*multi;
	if(systems[value].unmodify!=undefined)
	{
		systems[value].unmodify(multi);
	}
	ship.removeSlot(document.getElementById("slot"+id).parentElement.id, multi);
	ship.totalCost=ship.totalCost+calculateSizeValue(ship.calculateSize());
	document.getElementById("totalcostDiv").innerHTML = "$"+ship.totalCost;
	populateShipInfo();
	$("#slot"+id).remove();
}

function onSlotChange(id)
{
	removeMissileRack(id);
	var value = document.getElementById("systemSelect"+id).options[document.getElementById("systemSelect"+id).selectedIndex].value;
	var multi = getSlotSize(id);
	if(oldValues[id]!=null)
	{
		ship.totalCost = ship.totalCost - systems[oldValues[id]].price*multi;
		if(systems[oldValues[id]].unmodify!=null)
		{			
			systems[oldValues[id]].unmodify(multi);
		}
	}
	oldValues[id]=value;
	ship.totalCost = ship.totalCost+systems[value].price*multi;
	document.getElementById("totalcostDiv").innerHTML = "$"+ship.totalCost;
	if(systems[value].modify!=null)
	{
		systems[value].modify(multi, id);
	}	
	populateInformationDiv(value, multi);
	populateShipInfo();	
}

function populateInformationDiv(systemNumber, multi)
{
	document.getElementById("informationDiv").innerHTML=systems[systemNumber].display(multi);
}

function getSlotSize(id)
{
	if(document.getElementById("description"+id).innerHTML.indexOf("Super")!=-1)
	{
		return 4;
	}
	else if(document.getElementById("description"+id).innerHTML.indexOf("Heavy")!=-1)
	{
		return 2;
	}
	else
	{
		return 1;
	}
}

function calculateSizeValue(size)
{
	if(size==0)
	{
		return 0;
	}
	else if(size<2)
	{
		return 500;
	}
	else
	{
		return (size-1)*(size-1)*1000;
	}
}

function populateShipInfo()
{
	$('#shipInfo')[0].innerHTML="<b>Ship Stats:</b><br/>Size: "+ship.calculateSize()+" ("+ship.totalSlots+" slots)<br/>Speed: "+ship.calculateSpeed()+" ("+ship.thrust+" thrust)<br/>Defense: "+ship.calculateDefense() + "<br/>Max Shields: " + ship.shields + " Regen: " + ship.shieldRegen + "<br/>Cargo Capacity: " + (ship.cargo + ship.calculateBaseCargo()) + "<br/>Crew Max: " + (ship.crew + ship.calculateBaseCrew());
}

function canAddCore()
{
	var minSlots = ship.rightSlots;
	if(ship.leftSlots<minSlots){minSlots = ship.leftSlots;}
	if(ship.frontSlots<minSlots){minSlots = ship.frontSlots;}
	if(ship.rearSlots<minSlots){minSlots = ship.rearSlots;}
	if(ship.coreSlots<minSlots){return true;}
	return false;
}

function canAddOuter()
{
	var minSlots = ship.rightSlots;
	if(ship.leftSlots<minSlots){minSlots = ship.leftSlots;}
	if(ship.frontSlots<minSlots){minSlots = ship.frontSlots;}
	if(ship.rearSlots<minSlots){minSlots = ship.rearSlots;}
	if(ship.outerSlots<minSlots){return true;}
	return false;
}

function createMissileRack(id, missileCount)
{
	$('#rackHolder').append("<div id=\"rack"+id+"\"></div>")
	for(x=0; x<missileCount; x++)
	{
		var select = "<select id=\""+x+"missileSelect"+id+"\" onchange=\"onMissileChange("+x+","+id+");\">";
		for(y=0; y<missiles.length; y++)
		{
			select+="<option value='"+y+"'>"+missiles[y].name+"</option>";
		}
		select+="</select>";
		$("#rack"+id).append(select);
	}
}

function onMissileChange(x,id)
{
	var value = document.getElementById(x+"missileSelect"+id).options[document.getElementById(x+"missileSelect"+id).selectedIndex].value;
	if(oldMissileValues[x+"00"+id]!=null)
	{
		ship.totalCost = ship.totalCost - missiles[oldMissileValues[x+"00"+id]].price;
	}
	oldMissileValues[x+"00"+id]=value;
	ship.totalCost = ship.totalCost+missiles[value].price;
	document.getElementById("totalcostDiv").innerHTML = "$"+ship.totalCost;	
	populateInformationDiv(value, 1);
	populateShipInfo();	
}

function openMissileDivs(id)
{
	$("#rack"+id).dialog({autoOpen: true, title: 'WARNING: MISSILES ARE FOR EXPLODING', resizable: false, height:'400', width:'400', modal: true});
}

function removeMissileRack(id)
{
	$('#rack'+id+' select').each(function() 
	{
		ship.totalCost=ship.totalCost-missiles[this.options[this.selectedIndex].value].price;
	});
	$('#rack'+id).detach();
}