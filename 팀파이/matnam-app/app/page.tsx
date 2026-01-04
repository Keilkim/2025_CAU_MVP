'use client'

import { useState } from 'react'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'meetings' | 'chat' | 'profile'>('home')

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-orange-500">맛남의 광장</h1>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {activeTab === 'home' && <HomeContent />}
        {activeTab === 'explore' && <ExploreContent />}
        {activeTab === 'meetings' && <MeetingsContent />}
        {activeTab === 'chat' && <ChatContent />}
        {activeTab === 'profile' && <ProfileContent />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200">
        <div className="flex justify-around py-2">
          <NavButton
            icon="home"
            label="홈"
            active={activeTab === 'home'}
            onClick={() => setActiveTab('home')}
          />
          <NavButton
            icon="search"
            label="탐색"
            active={activeTab === 'explore'}
            onClick={() => setActiveTab('explore')}
          />
          <NavButton
            icon="calendar"
            label="미팅"
            active={activeTab === 'meetings'}
            onClick={() => setActiveTab('meetings')}
          />
          <NavButton
            icon="chat"
            label="채팅"
            active={activeTab === 'chat'}
            onClick={() => setActiveTab('chat')}
          />
          <NavButton
            icon="user"
            label="프로필"
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
          />
        </div>
      </nav>
    </div>
  )
}

function NavButton({ icon, label, active, onClick }: {
  icon: string
  label: string
  active: boolean
  onClick: () => void
}) {
  const icons: Record<string, JSX.Element> = {
    home: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    search: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    calendar: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    chat: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    user: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  }

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center py-1 px-3 ${active ? 'text-orange-500' : 'text-gray-400'}`}
    >
      {icons[icon]}
      <span className="text-xs mt-1">{label}</span>
    </button>
  )
}

// Home Content - 추천 사용자 피드
function HomeContent() {
  const mockUsers = [
    {
      id: 1,
      name: '김민지',
      age: 28,
      region: '성수동',
      bio: '카페 투어 좋아해요! 사진 찍는 것도 좋아합니다.',
      skills: ['사진 촬영', '카페 추천'],
      interests: ['카페', '브런치', '사진'],
      restaurant: '어니언 성수',
      foodImage: '/images/food-coffee.jpeg'
    },
    {
      id: 2,
      name: '이준혁',
      age: 32,
      region: '강남',
      bio: 'IT 업계 5년차입니다. 커리어 이야기 나눠요!',
      skills: ['개발 상담', '창업 경험'],
      interests: ['테크', '스타트업', '와인'],
      restaurant: '정식당',
      foodImage: '/images/food-wine.jpeg'
    },
    {
      id: 3,
      name: '박영희',
      age: 35,
      region: '홍대',
      bio: '요리하는 것을 좋아해요. 맛집 탐방도 자주 다녀요.',
      skills: ['요리 레시피', '맛집 정보'],
      interests: ['요리', '베이킹', '맛집'],
      restaurant: '연남동 파스타집',
      foodImage: '/images/food-pasta.jpeg'
    }
  ]

  return (
    <div className="p-4 space-y-4">
      {/* 지역 선택 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-sm text-gray-500 whitespace-nowrap">내 동네:</span>
        <button className="px-3 py-1 bg-orange-500 text-white text-sm rounded-full">성수동</button>
        <button className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">강남</button>
        <button className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">+ 추가</button>
      </div>

      {/* 추천 사용자 카드 */}
      {mockUsers.map(user => (
        <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-40 relative">
            <img src={user.foodImage} alt={user.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{user.name}, {user.age}</h3>
                <p className="text-sm text-gray-500">{user.region}</p>
              </div>
              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                매칭 85%
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-3">{user.bio}</p>

            {/* 나눌 수 있는 것 */}
            <div className="mb-3">
              <p className="text-xs text-gray-400 mb-1">나눌 수 있는 것</p>
              <div className="flex flex-wrap gap-1">
                {user.skills.map(skill => (
                  <span key={skill} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* 선호 맛집 */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{user.restaurant}에서 만나고 싶어요</span>
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-2">
              <button className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-600 text-sm hover:bg-gray-50">
                프로필 보기
              </button>
              <button className="flex-1 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600">
                미팅 신청
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Explore Content - 맛집/사용자 탐색
function ExploreContent() {
  return (
    <div className="p-4">
      {/* 검색바 */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="맛집 또는 지역 검색..."
          className="w-full px-4 py-3 pl-10 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
        {['전체', '한식', '일식', '양식', '카페', '술집'].map(cat => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
              cat === '전체' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 지도 영역 (플레이스홀더) */}
      <div className="h-48 bg-gray-200 rounded-xl mb-4 flex items-center justify-center">
        <span className="text-gray-400">카카오맵 연동 예정</span>
      </div>

      {/* 인기 맛집 */}
      <h3 className="font-semibold mb-3">내 동네 인기 맛집</h3>
      <div className="space-y-3">
        {[
          { name: '어니언 성수', category: '카페', users: 23 },
          { name: '을지로골뱅이', category: '한식', users: 18 },
          { name: '도쿄등심', category: '일식', users: 15 },
        ].map(restaurant => (
          <div key={restaurant.name} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-orange-500 text-lg">🍽️</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{restaurant.name}</h4>
              <p className="text-xs text-gray-500">{restaurant.category}</p>
            </div>
            <div className="text-right">
              <span className="text-sm text-orange-500 font-medium">{restaurant.users}명</span>
              <p className="text-xs text-gray-400">관심</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Meetings Content - 미팅 관리
function MeetingsContent() {
  return (
    <div className="p-4">
      {/* 탭 */}
      <div className="flex border-b border-gray-200 mb-4">
        <button className="flex-1 py-2 text-orange-500 border-b-2 border-orange-500 font-medium">
          받은 신청
        </button>
        <button className="flex-1 py-2 text-gray-400">
          보낸 신청
        </button>
        <button className="flex-1 py-2 text-gray-400">
          예정된 미팅
        </button>
      </div>

      {/* 미팅 신청 리스트 */}
      <div className="space-y-3">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-start gap-3 mb-3">
            <img src="/images/food-wine.jpeg" alt="이준혁" className="w-12 h-12 rounded-xl object-cover" />
            <div className="flex-1">
              <h4 className="font-medium">이준혁, 32</h4>
              <p className="text-xs text-gray-500">강남 · 2시간 전</p>
            </div>
            <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
              대기중
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            "커리어 이야기 나누면서 맛있는 거 먹어요! IT 업계 경험 공유해드릴게요."
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <span>📍 정식당</span>
            <span>·</span>
            <span>1월 5일 저녁 7시</span>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-600 text-sm">
              거절
            </button>
            <button className="flex-1 py-2 bg-orange-500 text-white rounded-lg text-sm">
              수락하기
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 opacity-60">
          <div className="flex items-start gap-3 mb-3">
            <img src="/images/food-pasta.jpeg" alt="박영희" className="w-12 h-12 rounded-xl object-cover" />
            <div className="flex-1">
              <h4 className="font-medium">박영희, 35</h4>
              <p className="text-xs text-gray-500">홍대 · 1일 전</p>
            </div>
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
              수락됨
            </span>
          </div>
          <p className="text-sm text-gray-600">
            요리 이야기 나눠요~
          </p>
        </div>
      </div>
    </div>
  )
}

// Chat Content - 채팅
function ChatContent() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        {/* 채팅방 리스트 */}
        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
          <div className="relative">
            <img src="/images/food-wine.jpeg" alt="이준혁" className="w-12 h-12 rounded-xl object-cover" />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-medium">이준혁</h4>
              <span className="text-xs text-gray-400">오후 2:30</span>
            </div>
            <p className="text-sm text-gray-500 truncate">네, 그럼 토요일에 뵙겠습니다!</p>
          </div>
          <span className="w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
            2
          </span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
          <img src="/images/food-pasta.jpeg" alt="박영희" className="w-12 h-12 rounded-xl object-cover" />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-medium">박영희</h4>
              <span className="text-xs text-gray-400">어제</span>
            </div>
            <p className="text-sm text-gray-500 truncate">맛집 정보 감사합니다 :)</p>
          </div>
        </div>
      </div>

      {/* 빈 상태 */}
      {false && (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p>아직 채팅이 없습니다</p>
          <p className="text-sm">미팅을 수락하면 채팅이 시작됩니다</p>
        </div>
      )}
    </div>
  )
}

// Profile Content - 프로필
function ProfileContent() {
  return (
    <div className="p-4">
      {/* 프로필 헤더 */}
      <div className="flex items-center gap-4 mb-6">
        <img src="/images/food-coffee.jpeg" alt="내 프로필" className="w-20 h-20 rounded-2xl object-cover shadow-lg" />
        <div>
          <h2 className="text-xl font-bold">김민지</h2>
          <p className="text-gray-500">28세 · 성수동</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-yellow-500">★</span>
            <span className="text-sm font-medium">4.8</span>
            <span className="text-sm text-gray-400">(12 리뷰)</span>
          </div>
        </div>
      </div>

      {/* 프로필 편집 버튼 */}
      <button className="w-full py-2 border border-orange-500 text-orange-500 rounded-lg mb-6 hover:bg-orange-50">
        프로필 수정
      </button>

      {/* 자기소개 */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">자기소개</h3>
        <p className="text-gray-600 text-sm">
          카페 투어 좋아해요! 사진 찍는 것도 좋아합니다. 맛있는 브런치 같이 먹을 분 찾아요~
        </p>
      </div>

      {/* 나눌 수 있는 것 */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">나눌 수 있는 것</h3>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">사진 촬영 팁</span>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">카페 추천</span>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">맛집 정보</span>
        </div>
      </div>

      {/* 관심사 */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">관심사</h3>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">카페</span>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">브런치</span>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">사진</span>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">여행</span>
        </div>
      </div>

      {/* 즐겨찾기 맛집 */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">즐겨찾기 맛집</h3>
        <div className="space-y-2">
          {['어니언 성수', '도쿄등심 강남', '블루보틀 삼청'].map(restaurant => (
            <div key={restaurant} className="flex items-center gap-2 text-sm text-gray-600">
              <span>📍</span>
              <span>{restaurant}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 설정 메뉴 */}
      <div className="border-t border-gray-100 pt-4 space-y-3">
        <button className="w-full flex items-center justify-between py-2 text-gray-600">
          <span>알림 설정</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button className="w-full flex items-center justify-between py-2 text-gray-600">
          <span>이용약관</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button className="w-full flex items-center justify-between py-2 text-red-500">
          <span>로그아웃</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>
  )
}
