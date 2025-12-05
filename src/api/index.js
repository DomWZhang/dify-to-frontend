const modules = {};

const files = import.meta.glob('./modules/*.js', { eager: true });

for (const [key, value] of Object.entries(files)) {
  const moduleName = key.split('/').pop().replace('.js', '');
  modules[moduleName] = value.default;
}

export default modules;
