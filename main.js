var data = {
	coins: 0,
	prestiges: [0,0,0,0,0,0,0,0,0,0]
};

function getGain() {
	var gain = 1;
	data.prestiges.forEach(function (el) {
		gain *= 1+el;
	})
	return gain;
}

function getRequirement(id) {
	if (id === 0) {
		return Math.floor(Math.pow(1.5,data.prestiges[0])*10);
	} else {
		return Math.pow(id+1,data.prestiges[id]+1)
	}
}

function canActivatePrestige(id) {
	if (id===0) {
		return (data.coins >= getRequirement(0));
	} else {
		return (data.prestiges[id-1] >= getRequirement(id));
	}
}

function activatePrestige(id) {
	if (canActivatePrestige(id)) {
			if (id===0) {
				data.coins -= getRequirement(0);
			}
			else {
				data.prestiges[id-1] -= getRequirement(i);
			}
			data.prestiges[id]++;
	}
	draw();
}

function resetPrestige() {
	data.coins = 0
	data.prestiges = [0,0,0,0,0,0,0,0,0,0]
	update()
	draw()
}

function update() {
	data.coins += getGain();
	localStorage.PrestigeSave = JSON.stringify(data);
}

function draw() {
	document.getElementById("coins").innerHTML = data.coins;
	document.getElementById("gain").innerHTML = getGain();
	data.prestiges.forEach(function (el, i) {
		document.getElementById("tier"+(i+1)+"cost").innerHTML = getRequirement(i);
		document.getElementById("tier"+(i+1)+"a").innerHTML = el;
		document.getElementById("tier"+(i+1)+"mul").innerHTML = "x"+(el+1);
		if (canActivatePrestige(i)) {
			document.getElementById("tier"+(i+1)+"btn").disabled = false;
		} else {
			document.getElementById("tier"+(i+1)+"btn").disabled = true;
		}
	})
}

window.addEventListener("load",function () {
	if (localStorage.PrestigeSave) {
		data = JSON.parse(localStorage.PrestigeSave)
	}
	draw();
	for (var i = 0; i < 10; i++) {
		document.getElementById("tier"+(i+1)+"btn").addEventListener(
			"click",
			(function(n) {
				return (function () {
					activatePrestige(n);
				})
			}(i))
		);
	}
	document.getElementById("reset").addEventListener(
		"click",
		(function(n) {
			return (function () {
				resetPrestige(n);
			})
		}(i))
	);
	setInterval(function () {
		update();
		draw();
	}, 1000);
	console.log("interval loaded")
})
