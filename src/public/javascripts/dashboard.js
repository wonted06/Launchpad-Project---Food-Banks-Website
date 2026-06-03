document.addEventListener('DOMContentLoaded', () => {
  const navBtns = document.querySelectorAll('.nav-btn[data-section]');
  const sections = document.querySelectorAll('.dash-section');

  function showSection(sectionId) {
    sections.forEach(s => {
      if (s.id === `section-${sectionId}`) {
        s.removeAttribute('hidden');
      } else {
        s.setAttribute('hidden', '');
      }
    });
    navBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.section === sectionId);
    });
  }

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => showSection(btn.dataset.section));
  });

  // Exercise cardio/strength toggle
  const exerciseTabBtns = document.querySelectorAll('.exercise-tab-btn');
  exerciseTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      exerciseTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.dataset.category;
      const cardioFields = document.getElementById('cardio-fields');
      const strengthFields = document.getElementById('strength-fields');
      if (cardioFields) cardioFields.hidden = category !== 'cardio';
      if (strengthFields) strengthFields.hidden = category !== 'strength';
    });
  });

  showSection('overview');
});
