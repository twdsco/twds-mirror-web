---
---
$(document).ready(() => {
$('.selectpicker').selectpicker()

var global_options = {% include options.json %};
var label_map = global_options.options.label_map;
var new_mirrors = {};
global_options.options.new_mirrors.forEach((m) => new_mirrors[m] = true);
var unlisted = global_options.options.unlisted_mirrors;
var options = {};
global_options.options.force_redirect_help_mirrors.forEach((m) => options[m] = {'url': "/help/" + m + "/"})
var descriptions = {};
global_options.options.mirror_desc.forEach((m) => descriptions[m.name] = m.desc);

new Vue({
	el: "#upgrade-mask",
});

const vmMirList = new Vue({
	el: "#mirror-list",
	data: {
		test: "hello",
		mirrorList: [],
		filter: "",
		rawMirrorList: [],
		dateTooltip: localStorage.getItem('DateTooltip') !== 'false',
		haveSearchBox: false,
	},
	created() {
		this.refreshMirrorList();
	},
	mounted() {
		if (this.$refs.search){
			this.haveSearchBox = true;
		}
		if (this.haveSearchBox){
			window.addEventListener("keypress", this.onKeyPress);
		}
		window.addEventListener("visibilitychange", this.onVisibilityChange);
	},
	beforeDestroy() {
		if (this.haveSearchBox){
			window.removeEventListener("keypress", this.onKeyPress);
		}
	},
	updated() {
		$('.mirror-item-label').popover();
	},
	computed: {
		nowBrowsingMirror: function() {
			var mirrorName = location.pathname.split('/')[1];
			if (!mirrorName){
				return false;
			}
			mirrorName = mirrorName.toLowerCase();
			const result = this.mirrorList.filter((m) => {
				return m.name.toLowerCase() === mirrorName;
			})[0];
			if (!result){
				return false;
			}
			return result;
		},
		filteredMirrorList: function() {
			var filter = this.filter.toLowerCase();
			return this.mirrorList.filter((m) =>  {
				return m.is_master && m.name.toLowerCase().indexOf(filter) !== -1;
			});
		},
	},
	methods: {
		getURL(mir) {
			if (mir.url !== undefined) {
				return mir.url
			}
			return `/${mir.name}/`
		},
		refreshMirrorList() {
			// do nothing if the tab is not visible
			if (document.hidden === true) {
				return;
			}
			var self = this;
			$.getJSON("{{ site.base }}/static/tunasync.json", (status_data) => {
				const unlisted_mir = unlisted.map(d => processMirrorItem(d))
				status_data = status_data.map(d => processMirrorItem(d));
				var mir_data = $.merge(unlisted_mir, status_data);
				mir_data = processLinkItem(mir_data);
				status_data = sortAndUniqMirrors(status_data);
				mir_data = sortAndUniqMirrors(mir_data);//.filter(d => !(d.status == "disabled"));
				mir_data = mir_data.map(m => {
					m.official = global_options.options.official_list.indexOf(m.name) != -1;
					return m;
				});
				self.mirrorList = mir_data;
				self.rawMirrorList = status_data;
				self.refreshTimer = setTimeout(() => {self.refreshMirrorList()}, 10000);
			});
		},
		onKeyPress(event) {
			if (event.key === '/' && document.activeElement !== this.$refs.search) {
				event.preventDefault();
				this.$refs.search.focus();
			}
		},
		onVisibilityChange() {
			// disable the timer anyway
			clearTimeout(this.refreshTimer);
			if (document.visibilityState === 'visible') {
				this.refreshMirrorList();
			}
		}
	}
})

var stringifyTime = (ts) => {
	const date = new Date(ts * 1000);
	var str = "";
	var ago = "";
	if (date.getFullYear() > 2000) {
		str = `${('000'+date.getFullYear()).substr(-4)}-${('0'+(date.getMonth()+1)).substr(-2)}-${('0'+date.getDate()).substr(-2)}` +
			` ${('0'+date.getHours()).substr(-2)}:${('0'+date.getMinutes()).substr(-2)}`;
		ago = timeago.format(date);
	} else {
		str = "0000-00-00 00:00";
		ago = "Never";
	}
	return [str, ago];
}

var sortAndUniqMirrors = (mirs) => {
	mirs.sort((a, b) => { return a.name < b.name ? -1: 1 });
	return mirs.reduce((acc, cur)=>{
		if(acc.length > 1 && acc[acc.length - 1].name == cur.name){
			if(acc[acc.length - 1].last_update_ts && cur.last_update_ts){
				if(acc[acc.length - 1].last_update_ts < cur.last_update_ts){
					acc[acc.length - 1] = cur;
				}
			} else if(cur.last_update_ts){
				acc[acc.length - 1] = cur;
			}
		}else{
			acc.push(cur);
		}
		return acc;
	}, []);
}

const processLinkItem = (mirrors) => {
	var processed = [];
	for (let d of mirrors) {
		if (d.link_to === undefined) {
			processed.push(d);
			continue;
		}
		for (const target of mirrors) {
			if (d.link_to === target.name) {
				d.status = target.status;
				d.label = target.label;
				d.upstream = target.upstream;
				d.show_status = target.show_status;
				d.last_update = target.last_update;
				d.last_update_ago = target.last_update_ago;
				d.last_ended = target.last_ended;
				d.last_ended_ago = target.last_ended_ago;
				d.last_schedule = target.last_schedule;
				d.last_schedule_ago = target.last_schedule_ago;
				processed.push(d);
				break;
			}
		}
	}
	return processed;
};

const processMirrorItem = (d) => {
	if (options[d.name] != undefined ) {
		d = $.extend(d, options[d.name]);
	}
	d.is_new = Boolean(new_mirrors[d.name]);
	d.description = descriptions[d.name];
	d.github_release = d.url && d.url.startsWith('/github-release/');
	if (d.is_master === undefined) {
		d.is_master = true;
	}
	if (d.link_to !== undefined) {
		return d;
	}
	d.label = label_map[d.status];
	d.show_status = (d.status != "success");
	// Strip the second component of last_update
	[d.last_update, d.last_update_ago] = stringifyTime(d.last_update_ts);
	[d.last_ended, d.last_ended_ago] = stringifyTime(d.last_ended_ts);
	[d.last_started, d.last_started_ago] = stringifyTime(d.last_started_ts);
	[d.next_schedule, d.next_schedule_ago] = stringifyTime(d.next_schedule_ts);
	return d;
}

var vmIso = new Vue({
	el: "#isoModal",
	data: {
		distroList: [],
		selected: {},
		curCategory: "",
		knownCategories: {
			os: "OS",
			app: "Application",
			font: "Font",
		},
		availableCategories: []
	},
	created: function() {
		var self = this;
		$.getJSON("{{ site.base }}/static/status/isoinfo.json", (isoinfo) => {
			self.distroList = isoinfo;
			self.availableCategories = [... new Set(isoinfo.map((x) => x.category))]
			self.curCategory = self.availableCategories[0];
			self.selected = self.curDistroList[0];
			if (window.location.hash.match(/#iso-download(\?.*)?/)) {
				$('#isoModal').modal();
			}
		});
	},
	computed: {
		curDistroList() {
			return this.distroList
				.filter((x) => x.category === this.curCategory)
				.sort(function (a, b) {
					return a.distro.localeCompare(b.distro);
				});
		},
	},
	methods: {
		switchDistro (distro) {
			this.selected = distro;
		},
		switchCategory (category) {
			this.curCategory = category;
			this.selected = this.curDistroList[0];
		}
	}
});

var sponsors = new Vue({
	el: "#sponsors",
	data: {
		sponsors: {
			names: [],
			progress: 0,
			progressText: 0,
			total: 0,
			totalFormated: '',
			targetFormated: '',
		},
	},
	created: function() {
		var self = this;
		$.getJSON("{{ site.base }}/mirror-sponsors.json", (sponsors) => {
			self.sponsors.names = sponsors;
			self.sponsors.total = sponsors.length * 550
			self.sponsors.target = 27500
			self.sponsors.progressText = (self.sponsors.total / self.sponsors.target * 100).toFixed()
			self.sponsors.progress = Math.min(self.sponsors.progressText, 100)
			self.sponsors.totalFormated = Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(self.sponsors.total)
			self.sponsors.targetFormated = Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(self.sponsors.target)
		});
	}
});

});

// vim: ts=2 sts=2 sw=2 noexpandtab
