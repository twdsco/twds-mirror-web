<script setup>
import { ref, onMounted } from "vue";

const sponsors = ref({
  names: [],
  progress: 0,
  progressText: "0",
  total: 0,
  totalFormated: "",
  targetFormated: "",
});

onMounted(async () => {
  try {
    const res = await fetch("/mirror-sponsors.json");
    if (!res.ok) return;
    const list = await res.json();
    const sorted = list
      .sort((a, b) => (b.streak - a.streak) || b.subtime - a.subtime)
      .map((s) => (s.streak > 1 ? `${s.name} × ${s.streak}` : s.name));
    const total = list.length * 550;
    const target = 41250;
    const progressText = ((total / target) * 100).toFixed();
    const fmt = (v) =>
      Intl.NumberFormat("zh-TW", {
        style: "currency",
        currency: "TWD",
        maximumFractionDigits: 0,
      }).format(v);
    sponsors.value = {
      names: sorted,
      progress: Math.min(Number(progressText), 100),
      progressText,
      total,
      totalFormated: fmt(total),
      targetFormated: fmt(target),
    };
  } catch (e) {
    // silently ignore
  }
});
</script>

<template>
  <ul v-if="sponsors.names.length">
    <li v-for="sponsor in sponsors.names" :key="sponsor">
      <strong>{{ sponsor }}</strong>
    </li>
  </ul>
  <div class="progress sponsor-progress mb-3" style="--bs-progress-height: 25px">
    <div
      class="progress-bar bg-success bg-opacity-50 text-black"
      :style="{ width: sponsors.progress + '%' }"
    >
      <strong
        >{{ sponsors.totalFormated }}/{{ sponsors.targetFormated }} TWD
        ({{ sponsors.progressText }}%)</strong
      >
    </div>
  </div>
</template>
