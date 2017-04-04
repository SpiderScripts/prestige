var data = {
	coins: 0,
	prestiges: [0,0,0,0,0,0,0,0,0,0]
};

function tick() {
	update(10);
	draw();
}

function romanize (num) {
    if (!+num)
        return false;
    var digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}

function getGain() {
	var gain = 1;
	data.prestiges.forEach(function (el) {
		gain *= 1+el;
	})
	return gain;
}

function getRequirement(id,no) {
	if (id === 0) {
		return Math.floor(Math.pow(1.2,data.prestiges[0])*((1-Math.pow(1.2,no))/(1-1.2))*10);
	} else {
		return Math.floor(Math.pow(id*1.2,data.prestiges[id]+1)*((1-Math.pow(1.2,no))/(1-1.2)));
	}
}

function canActivatePrestige(id,no) {
	if (id===0) {
		return (data.coins >= getRequirement(0,no));
	} else {
		return (data.prestiges[id-1] >= getRequirement(id,no));
	}		
}

function activatePrestige(id,no) {
	if (canActivatePrestige(id,no)) {
			if (id===0) {
				data.coins -= getRequirement(0,no);
			}
			else {
				data.prestiges[id-1] -= getRequirement(id,no);
			}
			data.prestiges[id] += no;
	}
	if ((id+1)==data.prestiges.length) {
		data.prestiges.push(0);
		addRow(id+1);
	}
	draw();
}

function resetPrestige() {
	clearInterval(cycle);
	data.prestiges.forEach(function (el, i) {
		document.getElementById("game").deleteRow(-1);
	});
	data = {
		coins: 0,
		prestiges: [0]
	};
	addRow(0);
	draw();
	localStorage.PrestigeSave = JSON.stringify(data);
	
	cycle = setInterval(function () { tick(); }, 10);
}

function update(interval) {
	var time = interval / 1000
	data.coins += getGain() * time;
	localStorage.PrestigeSave = JSON.stringify(data);
}

function addRow(i) {
	var table = document.getElementById("game");
	var row = table.insertRow();
	var tier = row.insertCell();
	var title = row.insertCell();
	var requirement = row.insertCell();
	var amount = row.insertCell();
	var effect = row.insertCell();
	var button1 = row.insertCell();
	var button10 = row.insertCell();
	tier.innerHTML = romanize(i+1);
	title.innerHTML = "Prestige Level...";
	requirement.innerHTML = "<span id=\"tier"+(i+1)+"cost\"></span> coins";
	amount.id = "tier"+(i+1)+"a";
	effect.id = "tier"+(i+1)+"mul";
	button1.innerHTML = "<button id=\"tier"+(i+1)+"btn\">Buy</button>";
	button10.innerHTML = "<button id=\"tier"+(i+1)+"btn10\">Buy 10</button>";

	document.getElementById("tier"+(i+1)+"btn").addEventListener("click", 
		(function(n) {
			return (function () {
				activatePrestige(n,1);
			})
		}(i))
	);
	document.getElementById("tier"+(i+1)+"btn10").addEventListener("click",
		(function(n) {
			return (function () {
				activatePrestige(n,10);
			})
		}(i))
	);
}

function draw() {
	document.getElementById("coins").innerHTML = Math.round(data.coins);
	document.getElementById("gain").innerHTML = getGain();
	data.prestiges.forEach(function (el, i) {
		document.getElementById("tier"+(i+1)+"cost").innerHTML = getRequirement(i,1);
		document.getElementById("tier"+(i+1)+"a").innerHTML = el;
		document.getElementById("tier"+(i+1)+"mul").innerHTML = "x"+(el+1);
		if (canActivatePrestige(i,1)) {
			document.getElementById("tier"+(i+1)+"btn").disabled = false;
		} else {
			document.getElementById("tier"+(i+1)+"btn").disabled = true;
		}
		if (canActivatePrestige(i,10)) {
			document.getElementById("tier"+(i+1)+"btn10").disabled = false;
		} else {
			document.getElementById("tier"+(i+1)+"btn10").disabled = true;
		}
	})
}

window.addEventListener("load",function () {
	if (localStorage.PrestigeSave) {
		data = JSON.parse(localStorage.PrestigeSave);
	}
	data.prestiges.forEach(function (el, i) {
		addRow(i);
	})
	draw();
	document.getElementById("reset").addEventListener("click",resetPrestige);
	cycle = setInterval(function () { tick(); }, 10);
})