import { useState, useEffect } from 'react'
import { ChevronDown, Pencil, Check, Star, Heart, Disc3 } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { useProfileStore } from '../store/useProfileStore'
import { usePlayerStore } from '../store/usePlayerStore'
import { BANNERS, AVATAR_COLORS, AVATAR_EMOJIS } from '../data/profileOptions'
import MixtapeIcon from './MixtapeIcon'

function ProfilePage({ isOpen, onClose }) {
  const user = useAuthStore((s) => s.user)
  const { bio, bannerId, avatarColor, avatarEmoji, showcaseMixtapeIds, updateProfile, toggleShowcase, saveProfile } =
    useProfileStore()
  const likedTrackIds = usePlayerStore((s) => s.likedTrackIds)
  const playlists = usePlayerStore((s) => s.playlists)
  const playCounts = usePlayerStore((s) => s.playCounts)
  const recentlyPlayed = usePlayerStore((s) => s.recentlyPlayed)

  const [isEditing, setIsEditing] = useState(false)
  const [draftBio, setDraftBio] = useState(bio)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setDraftBio(bio)
  }, [bio, isOpen])

  if (!isOpen) return null

  const currentBanner = BANNERS.find((b) => b.id === bannerId) || BANNERS[0]
  const totalSpins = Object.values(playCounts).reduce((a, b) => a + b, 0)
  const showcaseMixtapes = playlists.filter((p) => showcaseMixtapeIds.includes(p.id))
  const topTrackIds = Object.entries(playCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => id)

  async function handleSave() {
    setIsSaving(true)
    updateProfile({ bio: draftBio })
    await saveProfile()
    setIsSaving(false)
    setIsEditing(false)
  }

  return (
    <div className="fixed inset-0 z-[70] bg-void overflow-y-auto">
      <div className="grain-overlay" />
      <div className="scanline-overlay" />

      <button
        onClick={onClose}
        className="press-active fixed top-6 left-6 z-50 flex items-center gap-2 font-lcd tracking-widest text-lg text-taupe hover:text-paper"
      >
        <ChevronDown size={20} className="rotate-90" />
        BACK
      </button>

      {/* Tall glowing banner */}
      <div className="relative h-72 md:h-80" style={currentBanner.style}>
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/30 to-transparent" />

        {isEditing && (
          <div className="absolute top-6 right-6 metal-panel-raised rounded-lg p-3 border border-black/40 flex gap-2 z-10">
            {BANNERS.map((b) => (
              <button
                key={b.id}
                onClick={() => updateProfile({ bannerId: b.id })}
                className={`press-active w-10 h-8 rounded-md border-2 transition-colors ${
                  bannerId === b.id ? 'border-phosphor' : 'border-transparent'
                }`}
                style={b.style}
                title={b.name}
              />
            ))}
          </div>
        )}

        {/* Avatar with glow, cutting into the banner */}
        <div className="absolute -bottom-14 left-8 md:left-16">
          <div className="relative">
            <div
              className="absolute -inset-4 rounded-full blur-2xl opacity-60"
              style={{ background: avatarColor }}
            />
            <div
              className="relative w-28 h-28 rounded-full border-4 border-void flex items-center justify-center text-5xl shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
              style={{ background: avatarColor }}
            >
              {avatarEmoji}
            </div>
          </div>
          {isEditing && (
            <div className="absolute top-full left-0 mt-3 metal-panel-raised rounded-lg p-3 border border-black/40 flex flex-col gap-2 w-48 z-10">
              <div className="flex gap-1.5">
                {AVATAR_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => updateProfile({ avatarColor: color })}
                    className={`press-active w-6 h-6 rounded-full border-2 ${
                      avatarColor === color ? 'border-paper' : 'border-transparent'
                    }`}
                    style={{ background: color }}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {AVATAR_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => updateProfile({ avatarEmoji: emoji })}
                    className={`press-active w-7 h-7 rounded-md flex items-center justify-center text-sm border ${
                      avatarEmoji === emoji ? 'border-phosphor bg-phosphor/10' : 'border-white/10'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 md:px-16 pt-20 pb-20">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-4xl mb-1">{user?.displayName || 'You'}</h1>
            <p className="font-lcd text-phosphor text-sm tracking-widest [text-shadow:0_0_6px_rgba(255,59,59,0.6)]">
              // TAPE DECK OWNER
            </p>
          </div>
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            disabled={isSaving}
            className="press-active flex items-center gap-2 metal-panel-raised border border-black/40 rounded-full px-4 py-2 text-sm hover:border-phosphor/50 transition-colors disabled:opacity-50"
          >
            {isEditing ? <Check size={15} className="text-phosphor" /> : <Pencil size={15} />}
            {isSaving ? 'Saving...' : isEditing ? 'Save Profile' : 'Edit Profile'}
          </button>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="metal-panel-raised rounded-xl p-4 border border-black/40 text-center">
            <p className="font-display font-bold text-2xl text-phosphor">{likedTrackIds.length}</p>
            <p className="font-lcd text-taupe text-xs tracking-widest mt-1">LIKED TRACKS</p>
          </div>
          <div className="metal-panel-raised rounded-xl p-4 border border-black/40 text-center">
            <p className="font-display font-bold text-2xl text-phosphor">{playlists.length}</p>
            <p className="font-lcd text-taupe text-xs tracking-widest mt-1">MIXTAPES</p>
          </div>
          <div className="metal-panel-raised rounded-xl p-4 border border-black/40 text-center">
            <p className="font-display font-bold text-2xl text-phosphor">{totalSpins}</p>
            <p className="font-lcd text-taupe text-xs tracking-widest mt-1">TOTAL SPINS</p>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-10">
          {isEditing ? (
            <textarea
              value={draftBio}
              onChange={(e) => setDraftBio(e.target.value)}
              maxLength={160}
              rows={2}
              placeholder="What's your sound?"
              className="w-full metal-panel rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-phosphor/50"
            />
          ) : (
            <p className="text-taupe italic">{bio || 'No bio yet — click Edit Profile to add one.'}</p>
          )}
        </div>

        {/* Showcase — Steam-style featured shelf */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Star size={18} className="text-phosphor" />
            <h2 className="font-display font-bold text-xl">Showcase</h2>
          </div>

          {showcaseMixtapes.length === 0 && !isEditing && (
            <p className="font-lcd text-taupe tracking-wide">// NO MIXTAPES FEATURED YET</p>
          )}

          <div className="grid grid-cols-3 gap-4 mb-4">
            {showcaseMixtapes.map((p) => (
              <div
                key={p.id}
                className="metal-panel-raised rounded-xl p-4 border border-phosphor/40 flex flex-col items-center gap-2 shadow-[0_0_20px_rgba(255,59,59,0.15)]"
              >
                <MixtapeIcon trackCount={p.trackIds.length} size={80} />
                <p className="text-sm font-medium truncate w-full text-center">{p.name}</p>
                <p className="text-xs text-taupe">{p.trackIds.length} tracks</p>
              </div>
            ))}
          </div>

          {isEditing && (
            <div>
              <p className="font-lcd text-taupe text-xs tracking-widest mb-2">
                CLICK TO FEATURE (UP TO 3)
              </p>
              <div className="flex flex-wrap gap-2">
                {playlists.map((p) => {
                  const isFeatured = showcaseMixtapeIds.includes(p.id)
                  return (
                    <button
                      key={p.id}
                      onClick={() => toggleShowcase(p.id)}
                      className={`press-active flex items-center gap-2 rounded-md px-3 py-2 text-sm border transition-colors ${
                        isFeatured
                          ? 'border-phosphor bg-phosphor/10 text-phosphor'
                          : 'border-white/10 text-taupe hover:border-white/30'
                      }`}
                    >
                      <MixtapeIcon trackCount={p.trackIds.length} size={24} />
                      {p.name}
                    </button>
                  )
                })}
                {playlists.length === 0 && (
                  <p className="text-taupe text-sm">Make a mixtape first to feature it here.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Recent activity */}
        {recentlyPlayed.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Disc3 size={18} className="text-phosphor" />
              <h2 className="font-display font-bold text-xl">Recent Spins</h2>
            </div>
            <div className="flex flex-col gap-2">
              {recentlyPlayed.slice(0, 5).map((track) => (
                <div key={track.id} className="flex items-center gap-3 metal-panel-raised rounded-md p-2.5 border border-black/40">
                  <img src={track.cover} alt="" className="w-10 h-10 rounded object-cover" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{track.title}</p>
                    <p className="text-xs text-taupe truncate">{track.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top tracks */}
        {topTrackIds.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart size={18} className="text-phosphor" />
              <h2 className="font-display font-bold text-xl">Most Played</h2>
            </div>
            <div className="flex flex-col gap-2">
              {topTrackIds.map((id, i) => (
                <div key={id} className="flex items-center gap-3 metal-panel-raised rounded-md p-2.5 border border-black/40">
                  <span className="font-lcd text-phosphor text-lg w-5 text-center">{i + 1}</span>
                  <p className="text-sm text-taupe">{playCounts[id]} plays</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage