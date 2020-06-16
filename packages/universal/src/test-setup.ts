jest.mock('fs', () => {
  const actualFs = jest.requireActual('fs');
  const unionfs = require('unionfs').default;
  unionfs.reset = () => {
    // fss is unionfs' list of overlays
    unionfs.fss = [actualFs];
  };
  console.log(
    "ffassdf"
  )
  return unionfs.use(actualFs);
});
