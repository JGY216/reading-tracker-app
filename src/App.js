import React, { useState } from 'react';
import { BookOpen, Plus } from 'lucide-react';

const ReadingTrackerApp = () => {
  const [currentView, setCurrentView] = useState('main');
  const [streakDays] = useState(47);
  
  const [currentBook] = useState({
    title: '데미안',
    author: '헤르만 헤세',
    publisher: '민음사',
    cover: 'https://image.aladin.co.kr/product/1/55/letslook/8937460777_f.jpg',
    currentPage: 87,
    totalPages: 234
  });

  const [completedBooks] = useState([
    { 
      title: '해리포터와 마법사의 돌', 
      author: 'J.K. 롤링', 
      publisher: '문학수첩', 
      cover: 'https://image.aladin.co.kr/product/4705/87/letslook/8983925640_f.jpg',
      totalPages: 308
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl relative">
        <div className="p-4 pb-24">
          
          {/* 헤더 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">📚 독서기록 앱</h1>
            <p className="text-gray-600">알라딘 API 연동 버전</p>
            <p className="text-sm text-green-600 mt-2">✅ Netlify 배포 성공!</p>
          </div>
          
          {/* 연속 독서일 표시 */}
          <div className="bg-white rounded-xl p-6 shadow-lg border mb-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🌳</div>
              <div className="text-2xl font-bold text-green-600 mb-2">{streakDays}일 연속</div>
              <div className="text-sm text-gray-600">독서 연속일을 이어가고 있어요! 🔥</div>
            </div>
          </div>

          {/* 독서 통계 */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
              <div className="text-2xl font-bold text-blue-600">{completedBooks.length}</div>
              <div className="text-xs text-gray-600">완독한 책</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
              <div className="text-2xl font-bold text-green-600">{streakDays}</div>
              <div className="text-xs text-gray-600">연속 일수</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
              <div className="text-2xl font-bold text-purple-600">5</div>
              <div className="text-xs text-gray-600">기록한 문장</div>
            </div>
          </div>
          
          {/* 현재 읽는 책 */}
          {currentBook && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-center mb-4 flex items-center justify-center space-x-2">
                <BookOpen className="text-blue-500" size={24} />
                <span>읽는 중인 책</span>
              </h2>
              
              <div className="bg-white rounded-xl p-4 shadow-md border">
                <div className="flex items-start space-x-4">
                  <img 
                    src={currentBook.cover} 
                    alt={currentBook.title}
                    className="w-16 h-24 object-cover rounded-lg shadow-sm"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 mb-1">{currentBook.title}</h3>
                    <p className="text-gray-600 text-sm mb-1">{currentBook.author}</p>
                    <p className="text-gray-500 text-sm mb-2">{currentBook.publisher}</p>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>진행도</span>
                        <span>{currentBook.currentPage}/{currentBook.totalPages}쪽</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${(currentBook.currentPage / currentBook.totalPages) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* 버튼들 */}
          <div className="space-y-4">
            <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-all transform hover:scale-105">
              <Plus size={24} />
              <span className="font-semibold">새 책 추가하기</span>
            </button>
            
            <button 
              onClick={() => setCurrentView(currentView === 'main' ? 'bookshelf' : 'main')}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-4 rounded-xl font-semibold transition-colors"
            >
              📚 내 책장 보기 ({completedBooks.length}권)
            </button>
          </div>
          
          {/* 푸터 */}
          <div className="mt-8 text-center text-sm text-gray-500">
            🚀 Netlify 배포 성공!<br/>
            알라딘 API: ttbjeonggiy2229001<br/>
            Node.js {process.env.NODE_VERSION || '18.19.0'} 사용 중
          </div>
        </div>
        
        {/* 하단 네비게이션 */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t shadow-lg">
          <div className="flex">
            <button
              onClick={() => setCurrentView('main')}
              className={`flex-1 py-4 text-center transition-all ${
                currentView === 'main' 
                  ? 'text-green-600 bg-green-50 border-t-2 border-green-500' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="text-2xl mb-1">📊</div>
              <div className="text-xs font-semibold">메인</div>
            </button>
            <button
              onClick={() => setCurrentView('bookshelf')}
              className={`flex-1 py-4 text-center transition-all ${
                currentView === 'bookshelf' 
                  ? 'text-blue-600 bg-blue-50 border-t-2 border-blue-500' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="text-2xl mb-1">📚</div>
              <div className="text-xs font-semibold">책장</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingTrackerApp;