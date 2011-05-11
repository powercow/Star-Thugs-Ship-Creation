// Sean's Change Notes:
//
// replaced oldValues and oldSizes with ship.systems
// replaced ship.*Slots with calcFacingSlots function.
// replaced ship.totalSlots with calcTotalSlots function.
// removed ship.(add/remove)Slot functions.
// replaced canAdd(core/outer) functions with a more generic canAdd function.
// added shipMissile class and ship.missiles
// refactored ship.calculateCost to calculate the cost based on the current systems
//    and missiles and removed ship.totalCost and ship.extraCost.
// added a tad of missile info to the shipinfo display.

function system(args) 
{
	this.name = args.name;
	this.price = args.price;
	this.damage = args.damage;
	this.hp = args.hp;
	this.dr = args.dr;
	this.special = args.special;
	this.type = args.type;
	this.weapType = args.weapType;
	this.modify = args.modify;
	this.unmodify = args.unmodify;
	this.specialNum = args.specialNum;
	this.specialNum2 = args.specialNum2;
	this.additionalDisplay = args.additionalDisplay;
	this.additionalNumber = args.additionalNumber;
	this.display = function(size) 
	{
		var pants = "";
		var multi = sizeToMulti(size);
		pants+="<b>Name:</b> "+getSizeDescription(size)+" "+this.name+"<br/>";		
		pants+="<b>Price:</b> $"+this.price*multi+"<br/>";
		if(this.damage>0)
		{
			pants+="<b>Damage:</b> D"+this.damage*multi+"<br/>";
		}
		if(this.weapType)
		{
			pants+="<b>Type:</b> "+this.weapType+"<br/>";
		}
		if(this.hp>0)
		{
			var hpMulti = multi;
			if(size==2 || size==4)
			{
				hpMulti = hpMulti * 2;
			}
			pants+="<b>HP:</b> "+this.hp*hpMulti+"<br/>";
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

//Sizes: 1(normal) 2(turreted) 3(heavy) 4(turreted heavy) 5(super heavy)
function shipSystem(args)
{
	this.systemId = args.systemId;
	this.slotId = args.slotId;
	this.size = args.size;
	this.facing = args.facing;
	this.slotSize = args.slotSize;
	this.slotType = args.slotType;
}

function shipMissile(args)
{
	this.missileId = args.missileId;
	this.slotId = args.slotId;
}

function ship()
{
	this.thrust = 0;
	this.shields = 0;
	this.shieldRegen = 0;
	this.cargo = 0;
	this.crew = 0;
	this.sensors = 0;
	this.sizeCostMod = 0;
	this.systems = new Array();
	this.missiles = new Array();
	this.crewToSize = 0;
	this.calculateCost = function()
	{
		var cost = 0;
		//size cost
		cost += this.calculateSizeValue();
		//extra special system costs
		cost += calculateExtraSpecialSlotCost();
		//slot costs and system costs
		for(j=0;j<this.systems.length;j++)
		{
			if(typeCosts[this.systems[j].slotType])
			{
				cost += typeCosts[this.systems[j].slotType]*this.systems[j].slotSize;
			}
			cost += systems[this.systems[j].systemId].price*sizeToMulti(this.systems[j].size);
		}
		//missile costs
		for(j=0;j<this.missiles.length;j++)
			cost += missiles[this.missiles[j].missileId].price;
		return cost;
	}
	this.calculateRegen = function()
	{
		return this.shieldRegen;
	}
	this.calculateThrust = function()
	{
		return this.thrust;
	}
	this.calculateSpeed = function()
	{
		return Math.ceil(this.calculateThrust()/this.calculateSize());
	}
	this.calculateDefense = function()
	{
		return (this.calculateSpeed() - this.calculateSize());
	}
	this.calculateSize = function()
	{
		var size = Math.ceil((calcTotalSlots()-this.crewToSize)/5);
		if(size>8)
		{
			size = Math.ceil(Math.ceil((((calcTotalSlots()-this.crewToSize) - 40)/10))+8);
		}
		return size;
	}
	this.calculateBaseCrew = function()
	{
		crew = this.calculateSize() + 2 - 2*this.crewToSize;
		if(crew < 3)
			$("#remCrew").hide();
		else
			$("#remCrew").show();
		return crew;
	}
	this.calculateSizeValue = calculateSizeValue;
}

function missile(args)
{
	this.name = args.name;
	this.price = args.price;
	this.toHit = args.toHit;
	this.damage = args.damage;
	this.special = args.special;
	this.display = function()
	{		
		var pants = "";
		pants+="<b>Name:</b> "+this.name+"<br/>";
		pants+="<b>Cost:</b> "+this.price+"<br/>";
		pants+="<b>To Hit:</b> ";
		if(this.toHit >= 0)
			pants+=this.toHit+"+<br/>";
		else
			pants += '*<br/>';
		if(this.damage>0)
		{
			pants+="<b>Damage:</b> D"+this.damage+"<br/>";
		}
		if(this.special!=undefined)
		{
			pants+="<b>Special:</b> "+this.special+"<br/>";
		}
		return pants;
	}
}

var ship = new ship();

//var oldSizeValues = new Array();
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
typeCosts["Special"]=0;

var systems = new Array();
systems[0]=new system({type:"Weapon", weapType:"Laser", name:"10 MW Laser Cannon", price:1000, damage:3, hp:8, special:"Sustained Fire %s", specialNum:1});
systems[1]=new system({type:"Weapon", weapType:"Laser", name:"18 MW Laser Cannon", price:2500, damage:5, hp:8, special:"Sustained Fire %s", specialNum:1});
systems[2]=new system({type:"Weapon", weapType:"Laser", name:"Military Laser Cannon", price:8000, damage:10, hp:16, special:"Sustained Fire %s", specialNum:1});
systems[3]=new system({type:"Weapon", weapType:"Kinetic", name:"20mm Vulcan", price:1800, damage:2, hp:8, special:"3 shots per turn, Ammo max 6"});
systems[4]=new system({type:"Weapon", weapType:"Kinetic", name:"45mm Vulcan", price:4500, damage:4, hp:8, special:"3 shots per turn, Ammo max 5"});
systems[5]=new system({type:"Weapon", weapType:"Kinetic", name:"92mm Vulcan", price:8000, damage:7, hp:8, special:"3 shots per turn, Ammo max 4"});
systems[6]=new system({type:"Weapon", weapType:"Plasma", name:"20MW Light Plasma Cannon", price:5500, damage:9, hp:8});
systems[7]=new system({type:"Weapon", weapType:"Plasma", name:"40MW Plasma Cannon", price:8500, damage:12, hp:10});
systems[8]=new system({type:"Weapon", weapType:"Plasma", name:"80MW Military Plasma Cannon", price:18000, damage:18});
systems[9]=new system({type:"Weapon", weapType:"Kinetic Plasma", name:"Ion Rail", price:14000, damage:16, hp:8});
systems[10]=new system({type:"Weapon", weapType:"Kinetic Plasma", name:"Pulse Ion Rail", price:8000, damage:15, hp:8, special:"Fires Every Other Turn"});
systems[11]=new system({type:"Weapon", weapType:"Kinetic", name:"160mm Howitzer", price:4500, damage:8, hp:6, special:"Ammo max 4"});
systems[12]=new system({type:"Weapon", weapType:"Kinetic", name:"Rail Gun", price:28000, damage:24, hp:8});
systems[13]=new system({type:"Weapon", weapType:"Quantum Wave", name:"Cratermaster Cannon", price:75000, damage:4, hp:4, special:"Inflicts damage on first three systems. Ignores shields and armor DR."});
systems[14]=new system({type:"Weapon", weapType:"Quantum Gravity Wave", name:"Cratermaster Mk II", price:125000, damage:12, hp:4, special:"Hits target system regardless of intervening systems"});
systems[15]=new system({type:"Weapon", weapType:"Quantum Antimatter Wave", name:"Quasiprotonic Disrupter", price:70000, damage:40, hp:8});
systems[16]=new system({type:"Weapon", weapType:"Quantum Antimatter Wave", name:"Negatizer Beam", price:450000, damage:100, hp:8, special:"Ignores armor DR"});
systems[17]=new system({type:"Weapon", weapType:"Cable", name:"Tether Cable", price:5000, hp:12, special:"-2 to hit. Board at end of turn on successful hit."});
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
systems[42]=new system({type:"Weapon", weapType:"Missile", price:1000, name:"Missile Rack", hp:4, special:"Holds %s missiles", specialNum:3, modify:function(multi, id){createMissileRack(id,3*multi);}, unmodify:function(multi, id){removeMissileRack(id);}});
systems[52]=new system({type:"Cargo", name:"Cargo Bay", price:400, hp:8, modify:function(multi){ship.cargo = ship.cargo + 2*multi;}, unmodify:function(multi){ship.cargo = ship.cargo - 2*multi;}});
systems[53]=new system({type:"Cargo", name:"Autoloading Bay", price:8000, hp:8, modify:function(multi){ship.cargo = ship.cargo + 4*multi;}, unmodify:function(multi){ship.cargo = ship.cargo - 4*multi;}});
systems[54]=new system({type:"Cargo", name:"Armored Cargo Bay", price:10000, hp:16, dr:2, modify:function(multi){ship.cargo = ship.cargo + 2*multi;}, unmodify:function(multi){ship.cargo = ship.cargo - 2*multi;}});
systems[55]=new system({type:"Cargo", name:"Livestock Bay", price:1200, hp:8, modify:function(multi){ship.cargo = ship.cargo + 2*multi;}, unmodify:function(multi){ship.cargo = ship.cargo - 2*multi;}});
systems[56]=new system({type:"Cargo", name:"Refrigeration Bay", price:1200, hp:8, modify:function(multi){ship.cargo = ship.cargo + 2*multi;}, unmodify:function(multi){ship.cargo = ship.cargo - 2*multi;}});
systems[57]=new system({type:"Cargo", name:"Passenger Cabin", price:2000, hp:8, modify:function(multi){ship.crew = ship.crew + 2*multi;}, unmodify:function(multi){ship.crew = ship.crew - 2*multi;}});
systems[58]=new system({type:"Cargo", name:"Bunk Cabin", price:2500, hp:8, modify:function(multi){ship.crew = ship.crew + 3*multi;}, unmodify:function(multi){ship.crew = ship.crew - 3*multi;}});
systems[59]=new system({type:"Cargo", name:"Deluxe Passenger Cabin", price:10000, hp:6, modify:function(multi){ship.crew = ship.crew + 1*multi;}, unmodify:function(multi){ship.crew = ship.crew - 1*multi;}});
systems[67]=new system({type:"Special", name:"Ground Scanner", price:500, special:"Intensity +3 for scanning planet surface"});
systems[60]=new system({type:"Weapon", weapType:"Missile", name:"Missile Launcher", price:1500, hp:8, special:"Holds %s missiles", specialNum:4, modify:function(multi, id){createMissileRack(id,4*multi);}, unmodify:function(multi, id){removeMissileRack(id);}});
systems[61]=new system({type:"Weapon", weapType:"Missile", name:"Cyclic Missile Launcher", price:4500, hp:8, special:"Holds %s missiles", specialNum:8, modify:function(multi, id){createMissileRack(id,8*multi);}, unmodify:function(multi, id){removeMissileRack(id);}});
systems[62]=new system({type:"Weapon", weapType:"Missile", name:"Bale Missile Rack", price:5000, hp:8, special:"Holds %s missiles", specialNum:3, modify:function(multi, id){createMissileRack(id,3*multi);}, unmodify:function(multi, id){removeMissileRack(id);}, additionalDisplay:"Fires 3/turn"});
systems[63]=new system({type:"Weapon", weapType:"Missile", name:"Stormcrow Missile Launcher", price:12000, hp:8, special:"Holds %s missiles", specialNum:6, modify:function(multi, id){createMissileRack(id,4*multi);}, unmodify:function(multi, id){removeMissileRack(id);}, additionalDisplay:"Fires 3/round"});
systems[64]=new system({type:"Special", name:"High-Grade Sensor Array", price:500, special:"Intensity 2", modify:function(){ship.sensors += 2;}, unmodify:function(){ship.sensors -= 2;}});
systems[65]=new system({type:"Special", name:"Advanced Sensor Array", price:15000, special:"Intensity 4<br/>un-Bend one scanner or targeter per turn", modify:function(){ship.sensors += 4;},unmodify:function(){ship.sensors -= 4;}});
systems[66]=new system({type:"Special", name:"Hyper Sensor Array", price:150000, special:"Intensity 8<br/>un-Bend 2 scanners or targeters per turn", modify:function(){ship.sensors += 8;},unmodify:function(){ship.sensors -= 8;}});
systems[68]=new system({type:"Special", name:"Combat Scanner", price:500, special:"BEND to add Intensity to missile or direct-fire to-hit roll"});
systems[69]=new system({type:"Special", name:"Auxiliary Radar", price:5000, special:"Intensity +1", modify:function(){ship.sensors += 1;},unmodify:function(){ship.sensors -= 1;}});
systems[70]=new system({type:"Special", name:"Structural Scanner", price:8000, special:"BEND when hitting a ship to skip first layer of armor.<br/>req. Intensity 2+"});
systems[71]=new system({type:"Special", name:"Vector Interpolation Chip", price:4000, special:"BEND to reduce ship's defense by Intensity (min 0)"});
systems[72]=new system({type:"Special", name:"Target Verification System", price:2500, special:"+1 to hit with all missiles"});
systems[73]=new system({type:"Special", name:"Terminal Guidance Control", price:15000, special:"+2 to hit with all missiles"});
systems[74]=new system({type:"Special", name:"Sensor Control Computer", price:4000, special:"Intensitt +1", modify:function(){ship.sensors += 1;},unmodify:function(){ship.sensors -= 1;}});
systems[75]=new system({type:"Special", name:"Master Targeting Computer", price:8000, special:"+1 to hit with all non-missile weapons"});
systems[76]=new system({type:"Special", name:"Automated Weapon Targeter", price:500, special:"BEND for +2 to hit or +2 damage to a single weapon"});
systems[77]=new system({type:"Special", name:"Racing Chip", price:5000, special:"Thrust increases 20%, doubles fuel consumption", modify:function(){ship.calculateThrust=function(){return this.thrust * 1.2;};},unmodify:function(){ship.calculateThrust=function(){return this.thrust;};}});
systems[78]=new system({type:"Special", name:"Fuel Distribution Chip", price:500, special:"+1 Thrust, Reduces Size by 1 for calculating fuel consumption", modify:function(){ship.thrust += 1;},unmodify:function(){ship.thrust -= 1;}});
systems[79]=new system({type:"Special", name:"Shield Manifold Regulator", price:8000, special:"All shields gain DR 1 on facings with 3+ shield points when hit"});

function bfcCalcRegen()
{
	var shieldsys = 0;
	for (j=0; j<ship.systems.length; j++)
	{
		if (systems[ship.systems[j].systemId].type == 'Shield')
			shieldsys += 1;
	}
	return this.shieldRegen + shieldsys;
}
systems[80]=new system({type:"Special", name:"Bridge Flow Controller", price:15000, special:"+1 damage to all laser/plasma weapons, +1 Regen per shield generator", modify:function(){ship.calculateRegen = bfcCalcRegen;},unmodify:function(){ship.calculateRegen = function(){return this.shieldRegen;};}});
systems[81]=new system({type:"Special", name:"Vulcan Magazine", price:1000, special:"Reloads vulcan/howitzer weapon once per battle"});
systems[82]=new system({type:"Special", name:"Prysm Coil", price:2000, special:"+3 damage to linked laser weapon, destoryed if linked laser is damaged"});

function modifySizeCost(value)
{
	ship.sizeCostMod += value;
	updateCostDisplay();
}

function ultralightMod()
{
	ship.calculateSpeed = function()
	{
		var num = 0;
		if(this.calculateSize() > 1)
			num = 1;
		return Math.ceil(this.calculateThrust()/(this.calculateSize()-num));
	};
	modifySizeCost(2000);
}
function ultralightUnmod()
{
	ship.calculateSpeed = function(){return Math.ceil(this.calculateThrust()/this.calculateSize());};
	modifySizeCost(-2000);
}
systems[83]=new system({type:"Special", name:"Ultralight Frame", price:4000, special:"Costs $2000 extra per size value<br/>Reduces size by 1 for purposes of determining speed<br/>All systems take 1 more damage when hit", modify:ultralightMod, unmodify:ultralightUnmod});

function tankMod()
{
	ship.calculateSpeed = function()
	{
		return Math.ceil(this.calculateThrust()/(this.calculateSize()+1));
	};
	modifySizeCost(3000);
}
function tankUnmod()
{
	ship.calculateSpeed = function(){return Math.ceil(this.calculateThrust()/this.calculateSize());};
	modifySizeCost(-3000);
}
systems[84]=new system({type:"Special", name:"Tank Frame", price:6000, special:"Costs $3000 extra per size value<br/>Increaseses size by 1 for purposes of determining speed<br/>All systems gain +2 Damage Reduction", modify:tankMod, unmodify:tankUnmod});
systems[85]=new system({type:"Special", name:"|\|Uk3z0r Chip", price:25000, special:"BEND when hacking a ship to hack all computer systems simultaneously"});
systems[86]=new system({type:"Special", name:"Point Defense Array", price:2000, special:"Costs 1,000 extra per size value<br/>destroys missiles on a roll of 10+", modify:function(){modifySizeCost(1000);}, unmodify:function(){modifySizeCost(-1000);}});
systems[87]=new system({type:"Special", name:"Sensor Scrambler", price:2000, special:"Costs 1,000 extra per size value<br/>-2 enemy sensor intensity", modify:function(){modifySizeCost(1000);}, unmodify:function(){modifySizeCost(-1000);}});
systems[88]=new system({type:"Special", name:"Stealth Coat", price:5000, special:"Costs 2000 extra per size value<br/>-2 enemy sensor intensity<br/>if enemy intensity < 1 then -2 to hit at medium, -4 at long and for missiles", modify:function(){modifySizeCost(2000);}, unmodify:function(){modifySizeCost(-2000);}});

var missiles = new Array();
missiles[0]=new missile({name:"Empty",price:0,toHit:0,damage:0});
missiles[1]=new missile({name:"Hornet",price:150,toHit:5,damage:7});
missiles[2]=new missile({name:"Wasp",price:300,toHit:4,damage:9});
missiles[3]=new missile({name:"Cyclone",price:1000,toHit:2,damage:12});
missiles[4]=new missile({name:"Lance",price:650,toHit:5,damage:16});
missiles[5]=new missile({name:"Typhoon",price:1200,toHit:3,damage:18});
missiles[6]=new missile({name:"Rapier",price:5000,toHit:1,damage:16,special:"bypasses first armor system it hits, ignores up to 15 points of shields"});
missiles[7]=new missile({name:"Medusa Shield Disruptor",price:1000,toHit:5,damage:0,special:"Inflicts 20 damage to shields on facing and 10 damage to shields on adjacent facings"});
missiles[8]=new missile({name:"Hammerhead",price:2000,toHit:8,damage:40});
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

function populateSpecials()
{
	var sselect = "";
	var specials = $("#special .specialSlot");
	if(specials.length < ship.calculateSize())
	{
		for(x=specials.length; x<ship.calculateSize(); x++)
		{
			sselect+="<div id=\"slot"+i+"\" class=\"specialSlot\"><span id=\"description"+i+"\" title=\"click to display information\" class=\"description\" onclick=\"populateInformationDiv(document.getElementById('systemSelect"+i+"').options[document.getElementById('systemSelect"+i+"').selectedIndex].value, 1);\"><b>Special Slot:</b></span><select id=\"systemSelect"+i+"\" onchange=\"onSlotChange('"+i+"');\"><option value=\"41\">EMPTY</option>";
			for(y=0; y<systems.length;y++)
			{
				if(systems[y].type=="Special")
				{
					sselect+="<option value='"+y+"'>"+systems[y].name+"</option>";
				}
			}
			sselect+="</select></div>";
			$("#special").append(sselect);
			ship.systems.push(new shipSystem({slotId:i, systemId:41, facing:'special', size:1, slotSize:0, slotType:"Special"}));
			i++;
		}
	}
	else
	{
		if(specials.length > ship.calculateSize())
		{
			var lastSpec;
			for(j=0; j < ship.systems.length; j++)
				if(ship.systems[j].facing == "special")
				{
					lastSpec = j;
				}
			removeSlot(ship.systems[lastSpec].slotId);
		}
	}
	updateCostDisplay();
}

function addSpecialSlot()
{
	var sselect="<div id=\"slot"+i+"\" class=\"extraSpecialSlot\"><span id=\"description"+i+"\" title=\"click to display information\" class=\"description\" onclick=\"populateInformationDiv(document.getElementById('systemSelect"+i+"').options[document.getElementById('systemSelect"+i+"').selectedIndex].value, 1);\"><b>Special Slot:</b></span><select id=\"systemSelect"+i+"\" onchange=\"onSlotChange('"+i+"');\"><option value=\"41\">EMPTY</option>";
	for(y=0; y<systems.length;y++)
	{
		if(systems[y].type=="Special")
		{
			sselect+="<option value='"+y+"'>"+systems[y].name+"</option>";
		}
	}
	sselect+="</select><a href=\"#\" onClick=\"removeSlot("+i+");\">remove</a></div>";
	$("#special").append(sselect);
	ship.systems.push(new shipSystem({slotId:i, systemId:41, facing:'extraSpecial', size:1, slotSize:0, slotType:"Special"}));
	updateCostDisplay();
	i++;
}

function calculateExtraSpecialSlotCost()
{
	var naturalSpecial = $("#special .specialSlot").length;
	var extraSpecial = $("#special .extraSpecialSlot").length;
	var extraCost = 0;
	for(y=0; y<extraSpecial;y++)
	{
		extraCost += 3000+(1000*naturalSpecial);
		naturalSpecial++;
	}
	return extraCost;
}

function addSlot(id, slotType, systemPredicate)
{
	if(!systemPredicate)
		systemPredicate = function(x) { return systems[x].type==value || (value=="Universal" && x!=41 && systems[x].type != "Special"); }
	var multi = 1;
	var value;
	if(slotType)
		value = slotType;
	else
		value = document.getElementById("slotSelect"+id).options[document.getElementById("slotSelect"+id).selectedIndex].value;
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
	select+="getSystemSize("+i+"));\"><b>";
	if(multi>2)
	{
		select+="Super ";
	}
	else if(multi>1)
	{
		select+="Heavy ";
	}
	select+=value+" Slot:</b><a href=\"#\" onClick=\"removeSlot("+i+");\">remove</a></span><br/>";
	if(id=="core" && !canAdd('core',multi))
	{
		alert("You cannot have more core slots than you have slots in front, left, right, or rear");
		return false;
	}	
	if(id=="outer" && !canAdd('outer',multi))
	{
		alert("You cannot have more outer slots than you have slots in front, left, right, or rear");
		return false;
	}
	select += "<select id=\"systemSelect"+i+"\" onchange=\"onSlotChange('"+i+"');\"><option value=\"41\">EMPTY</option>";
	for(x=0; x<systems.length; x++)
	{
		if(systemPredicate(x))
		{
			select+="<option value='"+x+"'>"+systems[x].name+"</option>";
		}
	}
	select+="</select>";	
	if(slotType == 'Turreted Weapon')
		multi = 2;
	select+=buildSizeSelect(multi);
	select+="</div>";
	$("#"+id).append(select);
	if(slotType == 'Turreted Weapon')
	{		
		$("#sizeSelect"+i)[0].selectedIndex=1;
		$("#sizeSelect"+i+" .syssize").hide();
	}
	ship.systems.push(new shipSystem({slotId:i, systemId:41, facing:id, size:1, slotSize:multi, slotType:value}));
	i++;
	updateCostDisplay();
	populateSpecials();
	populateShipInfo();
}

//Function's pretty simple now, if crew gets added to this it may get more complex.
function buildSizeSelect(multi)
{
	var sl ="";
	if(multi<2)
	{
		return sl;
	}
	else
	{
		sl += "<select id=\"sizeSelect"+i+"\" onchange=\"onSlotChange("+i+");\"><option value=\"1\" class=\"syssize\">Normal</option><option value=\"2\" class=\"turret\">Turreted</option><option value=\"3\" class=\"syssize\">Heavy</option>";
	}
	if(multi>2)
	{
		sl += "<option value=\"4\" class=\"turret\">Heavy Turreted</option><option value=\"5\" class=\"syssize\">Super Heavy</option>"
	}
	sl +="</select>";
	return sl;
	
}

function updateCostDisplay()
{
	document.getElementById("totalcostDiv").innerHTML = "$"+ship.calculateCost();
}

function getSystemKeyById(id)
{
	for (j=0; j< ship.systems.length; j++)
		if (ship.systems[j].slotId == id)
			return j;
}

function removeSlot(id)
{
	var syskey = getSystemKeyById(id);
	var oldSys = ship.systems[syskey];
	if(systems[oldSys.systemId].unmodify!=undefined)
	{
		systems[oldSys.systemId].unmodify(sizeToMulti(oldSys.size), id);
	}
	ship.systems.splice(syskey,1);
	updateCostDisplay();
	$("#slot"+id).remove();
	populateSpecials();
	populateShipInfo();	
}

function onSlotChange(id)
{
	var syskey = getSystemKeyById(id)
	var oldSystem = ship.systems[syskey];
	var value = document.getElementById("systemSelect"+id).options[document.getElementById("systemSelect"+id).selectedIndex].value;
	var facing = document.getElementById("slot"+id).parentNode.id;
	var size = getSystemSize(id);
	var multi = sizeToMulti(size);
	if(systems[oldSystem.systemId].unmodify!=null)
	{
		systems[oldSystem.systemId].unmodify(sizeToMulti(oldSystem.size), id);
	}
	ship.systems[syskey].systemId = parseInt(value);
	ship.systems[syskey].size = size;
	if(systems[value].modify!=null)
	{
		systems[value].modify(multi, id);
	}
	if(systems[value].type=="Weapon")
	{
		$("#sizeSelect"+id+" .turret").show();
	}
	else
	{
		$("#sizeSelect"+id+" .turret").hide();
		if($("#sizeSelect"+id)[0] != null)
			if ($("#sizeSelect"+id)[0].selectedIndex==1||$("#sizeSelect"+id)[0].selectedIndex==3)
			{
				$("#sizeSelect"+id)[0].selectedIndex=0;
				$("#sizeSelect"+id)[0].value=1;
			}
	}
	updateCostDisplay();
	populateInformationDiv(value, size);
	populateShipInfo();
}

function populateInformationDiv(systemNumber, size)
{
	document.getElementById("informationDiv").innerHTML=systems[systemNumber].display(size);
}

function populateInformationDivMissile(missileNumber)
{
	document.getElementById("informationDiv").innerHTML=missiles[missileNumber].display();
}

function getSystemSize(id)
{
	if(document.getElementById("sizeSelect"+id)!=null)
	{
		return document.getElementById("sizeSelect"+id).options[document.getElementById("sizeSelect"+id).selectedIndex].value;
	}
	else
	{
		return 1;
	}
}

function calculateSizeValue()
{
	size = ship.calculateSize();
	if(size==0)
	{
		return 0;
	}
	else if(size<2)
	{
		return 500 + ship.sizeCostMod;
	}
	else
	{
		return (size-1)*(size-1)*1000 + ship.sizeCostMod*size;
	}
}

function missileDisplay()
{
	var misnum = 0;
	for(j=0;j<ship.missiles.length;j++)
		if(ship.missiles[j].missileId != 0)
			misnum++;
	return misnum + '/' + ship.missiles.length;
}

function crewSizeDisp()
{
	if(ship.crewToSize == 0)
		return "";
	else
		return ": " + ship.crewToSize + " free)";
}

function populateShipInfo()
{
	$('#shipInfo')[0].innerHTML="Size: "+ship.calculateSize()+" ("+calcTotalSlots()+" slots"+crewSizeDisp()+")<br/>Speed: "+ship.calculateSpeed()+" ("+ship.calculateThrust()+" thrust)<br/>Defense: "+ship.calculateDefense() + "<br/>Max Shields: " + ship.shields + " Regen: " + ship.calculateRegen() + "<br/>Cargo Capacity: " + (ship.cargo + ship.calculateSize()) + "<br/>Crew Max: " + (ship.crew + ship.calculateBaseCrew()) + "<br/>Sensor Intensity: " + ship.sensors + "<br/>Missiles: " + missileDisplay();
}

function calcTotalSlots()
{
	var num = 0;
	for(j=0; j<ship.systems.length; j++)
		num += ship.systems[j].slotSize;
	return num;
}

function calcFacingSlots(fid)
{
	var num = 0;
	for(j=0; j<ship.systems.length; j++)
		if(ship.systems[j].facing == fid)
			num += ship.systems[j].slotSize;
	return num;
}

function canAdd(fid, multi)
{
	var minSlots = calcFacingSlots('right');
	if(calcFacingSlots('left')<minSlots){minSlots = calcFacingSlots('left');}
	if(calcFacingSlots('front')<minSlots){minSlots = calcFacingSlots('front');}
	if(calcFacingSlots('rear')<minSlots){minSlots = calcFacingSlots('rear');}
	return (calcFacingSlots(fid)+multi <= minSlots);
}

function getMissileKeyById(id)
{
	for(j=0;j<ship.missiles.length;j++)
		if(ship.missiles[j].slotId == id)
			return j;
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
		ship.missiles.push(new shipMissile({slotId:x+"missileSelect"+id, missileId:0}));
	}
	$('#slot'+id).append('<div style="clear:left;" id="racklink'+id+'"><a href="#" onclick="openMissileDivs('+id+');">Click here! fill it with missiles!</a></div>');
}

function onMissileChange(x,id)
{
	var value = document.getElementById(x+"missileSelect"+id).options[document.getElementById(x+"missileSelect"+id).selectedIndex].value;
	var miskey = getMissileKeyById(x+"missileSelect"+id);
	var oldMissile = ship.missiles[miskey];
	ship.missiles[miskey].missileId=value;
	updateCostDisplay();
	populateInformationDivMissile(value, 1);
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
		ship.missiles.splice(getMissileKeyById(this.id),1);
	});
	$('#rack'+id).detach();
	$('#racklink'+id).detach();
}

function sizeToMulti(size)
{
	if(size<3)
	{
		return 1;
	}
	else if(size<5)
	{
		return 2;
	}
	else
	{
		return 4;
	}
}

function getSizeDescription(size)
{
	switch(size)
	{
	case "1":
	  return "";
	  break;
	case "2":
	  return "Turreted";
	  break;
	case "3":
	  return "Heavy";
	  break;
	case "4":
	  return "Heavy Turreted";
	  break;
	case "5":
	  return "Super Heavy";
	  break;
	default:
	  return "";
	}
}

function changeSystemSize(id)
{
	populateInformationDiv(document.getElementById("systemSelect"+id).options[document.getElementById("systemSelect"+id).selectedIndex].value, document.getElementById("sizeSelect"+id).options[document.getElementById("sizeSelect"+id).selectedIndex].value);
}

function missilesOnly(x)
{
	return systems[x].weapType == "Missile";
}
function addMissileSlot(facing)
{
	addSlot(facing, 'Missile', missilesOnly);
}

function missilesAndAmmoOnly(x)
{
	if(systems[x].special)
		return missilesOnly(x) || (systems[x].type == 'Weapon' && systems[x].special.indexOf('Ammo') != -1);
	return false;
}
function addMissileAmmoSlot(facing)
{
	addSlot(facing, 'Ammo/Missile Weapon', missilesAndAmmoOnly);
}

function addTurretSlot(facing)
{
	addSlot(facing, 'Turreted Weapon', function(x) { return systems[x].type == 'Weapon'; });
}

function remCrew()
{
	ship.crewToSize += 1;
	$("#addCrew").show();
	populateShipInfo();
}
function addCrew()
{
	ship.crewToSize -= 1;
	if(ship.crewToSize < 1)
		$('#addCrew').hide();
	populateShipInfo();
}