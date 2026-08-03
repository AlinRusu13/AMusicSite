import DJDeck from './DJDeck'
import Crossfader from './Crossfader'

function DJBooth() {
  return (
    <div className="mb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
        <DJDeck label="A" />
        <DJDeck label="B" />
      </div>
      <div className="metal-panel rounded-xl px-6 border border-black/40">
        <Crossfader />
      </div>
    </div>
  )
}

export default DJBooth