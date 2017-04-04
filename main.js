var data = {
	coins: 0,
	prestiges: [0,0,0,0,0,0,0,0,0,0]
};

var cycle;

function tick() {
	update(10);
	draw();
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
		return (data.prestiges[id-1] >= getRequirement(id.no));
	}		
}

function activatePrestige(id,no) {
	console.log("Prestige activated");
	console.log(id);
	console.log(no);
	if (canActivatePrestige(id,no)) {
			if (id===0) {
				data.coins -= getRequirement(0,no);
			}
			else {
				data.prestiges[id-1] -= getRequirement(id,no);
			}
			data.prestiges[id] += no;
	}
	draw();
}

function resetPrestige() {
	clearInterval(cycle);
	data = {
		coins: 0,
		prestiges: [0,0,0,0,0,0,0,0,0,0]
	};
	localStorage.PrestigeSave = JSON.stringify(data);
	cycle = setInterval(function () { tick(); }, 10);
}

function update(interval) {
	var time = interval / 1000
	data.coins += getGain() * time;
	localStorage.PrestigeSave = JSON.stringify(data);
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
	draw();
	for (var i = 0; i < 10; i++) {
		document.getElementById("tier"+(i+1)+"btn").addEventListener("click", 
			(function(n) {
				return (function () {
					activatePrestige(n,1);
				})
			}(i))
		});
		document.getElementById("tier"+(i+1)+"btn10").addEventListener("click", function() {
			activatePrestige(i,10);
		});
	}
	document.getElementById("reset").addEventListener("click",resetPrestige);
	cycle = setInterval(function () { tick(); }, 10);
})
