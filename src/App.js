import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Square, Plus, Search, Camera, Edit3, Clock, Timer, BookOpen, Heart, Star, Trophy } from 'lucide-react';

const ReadingTrackerApp = () => {
  const [currentView, setCurrentView] = useState('main');
  const [streakDays, setStreakDays] = useState(47);
  const [lastReadDate, setLastReadDate] = useState(new Date().toDateString());
  
  const [currentBook, setCurrentBook] = useState({
    id: 1,
    title: '데미안',
    author: '헤르만 헤세',
    publisher: '민음사',
    cover: 'https://image.aladin.co.kr/product/1/55/letslook/8937460777_f.jpg',
    currentPage: 87,
    totalPages: 234,
    sentences: [
      '새는 알을 깨뜨리고 나온다. 알은 새의 세계다.',
      '우리가 무엇인가를 바라면 그것이 우리에게 다가온다.',
      '모든 사람은 자기 자신이 되려고 애쓰며 살고 있다.'
    ],
    readingSessions: [
      { date: '2024-07-30', pages: 15, minutes: 45 },
      { date: '2024-07-29', pages: 12, minutes: 32 }
    ]
  });
  
  const [upcomingBooks, setUpcomingBooks] = useState([
    { 
      id: 2,
      title: '1984', 
      author: '조지 오웰', 
      publisher: '민음사', 
      cover: 'https://image.aladin.co.kr/product/1/76/letslook/8937462788_f.jpg',
      totalPages: 328
    },
    { 
      id: 3,
      title: '어린왕자', 
      author: '생텍쥐페리', 
      publisher: '문학동네', 
      cover: 'https://image.aladin.co.kr/product/8954/65/letslook/8954654266_f.jpg',
      totalPages: 96
    }
  ]);
  
  const [completedBooks, setCompletedBooks] = useState([
    { 
      id: 0,
      title: '해리포터와 마법사의 돌', 
      author: 'J.K. 롤링', 
      publisher: '문학수첩', 
      cover: 'https://image.aladin.co.kr/product/4705/87/letslook/8983925640_f.jpg',
      sentences: [
        '해리포터, 너는 마법사야',
        '호그와트로 가는 기차는 9와 3/4 승강장에서 출발한다',
        '용기는 모든 것을 이겨낼 수 있다'
      ],
      aiSummary: '해리포터가 마법사임을 알게 되고 호그와트에서 새로운 친구들과 모험을 시작하는 성장 이야기입니다.',
      completedDate: '2024-07-25',
      totalPages: 308,
      readingDays: 12
    }
  ]);
  
  const [timerMode, setTimerMode] = useState('stopwatch');
  const [timerValue, setTimerValue] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerInput, setTimerInput] = useState(25);
  const intervalRef = useRef(null);
  
  const [showAddBook, setShowAddBook] = useState(false);
  const [showSentenceInput, setShowSentenceInput] = useState(false);
  const [showPageInput, setShowPageInput] = useState(false);
  const [newSentence, setNewSentence] = useState('');
  const [pageInput, setPageInput] = useState('');
  const [newBook, setNewBook] = useState({ title: '', author: '', publisher: '', totalPages: '' });
  
  // 도서 검색 관련 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showBookSearch, setShowBookSearch] = useState(false);

// 실제 알라딘 API 검색 함수
  const searchBooks = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      // 실제 알라딘 API 호출 시도
      const aladinApiKey = 'ttbjeonggiy2229001';
      const searchUrl = `https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${aladinApiKey}&Query=${encodeURIComponent(query)}&QueryType=Title&MaxResults=20&start=1&SearchTarget=Book&output=js&Version=20131101&Cover=Big`;
      
      console.log('알라딘 API 호출:', searchUrl);
      
      let apiSuccess = false;
      
      // JSONP 방식으로 API 호출
      try {
        const result = await searchBooksJSONP(query);
        if (result && result.length > 0) {
          setSearchResults(result);
          apiSuccess = true;
        }
      } catch (apiError) {
        console.log('알라딘 API 실패, 시뮬레이션 데이터 사용:', apiError);
      }
      
      // API 실패 시 시뮬레이션 데이터 사용
      if (!apiSuccess) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockResults = [
          {
            id: 'demo1',
            title: '데미안',
            author: '헤르만 헤세',
            publisher: '민음사',
            totalPages: 234,
            cover: 'https://image.aladin.co.kr/product/1/55/letslook/8937460777_f.jpg',
            isbn: '9788937460777',
            description: '성장과 자아 발견의 이야기',
            publishedDate: '2020'
          },
          {
            id: 'demo2',
            title: '82년생 김지영',
            author: '조남주',
            publisher: '민음사',
            totalPages: 136,
            cover: 'https://image.aladin.co.kr/product/9473/50/letslook/8937473500_f.jpg',
            isbn: '9788937473500',
            description: '한국 여성의 현실을 그린 소설',
            publishedDate: '2016'
          },
          {
            id: 'demo3',
            title: '채식주의자',
            author: '한강',
            publisher: '창비',
            totalPages: 184,
            cover: 'https://image.aladin.co.kr/product/4702/41/letslook/8936470248_f.jpg',
            isbn: '9788936470241',
            description: '맨부커상 수상작',
            publishedDate: '2019'
          },
          {
            id: 'demo4',
            title: '미움받을 용기',
            author: '기시미 이치로',
            publisher: '인플루엔셜',
            totalPages: 216,
            cover: 'https://image.aladin.co.kr/product/9919/91/letslook/8996991433_f.jpg',
            isbn: '9788996991434',
            description: '아들러 심리학 기반 자기계발서',
            publishedDate: '2014'
          }
        ];
        
        const filteredResults = mockResults.filter(book => 
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.author.toLowerCase().includes(query.toLowerCase())
        );
        
        setSearchResults(filteredResults);
      }
      
    } catch (error) {
      console.error('검색 오류:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // JSONP 방식으로 알라딘 API 호출
  const searchBooksJSONP = useCallback((query) => {
    return new Promise((resolve, reject) => {
      const aladinApiKey = 'ttbjeonggiy2229001';
      const callbackName = `aladinCallback_${Date.now()}`;
      
      window[callbackName] = (data) => {
        try {
          if (data.item && data.item.length > 0) {
            const books = data.item.map(item => ({
              id: item.isbn13 || item.isbn || `aladin_${Date.now()}_${Math.random()}`,
              title: item.title?.replace(/ - .+$/, '') || '제목 없음',
              author: item.author || '저자 미상',
              publisher: item.publisher || '출판사 미상',
              publishedDate: item.pubDate || '',
              totalPages: item.subInfo?.itemPage || 200,
              cover: item.cover || `https://via.placeholder.com/128x192/4F46E5/FFFFFF?text=${encodeURIComponent((item.title || '책').slice(0, 2))}`,
              isbn: item.isbn13 || item.isbn || '',
              description: item.description || `${item.categoryName || '일반도서'} 분야의 도서입니다.`,
              price: item.priceStandard || 0,
              categoryName: item.categoryName || '일반도서'
            }));
            
            resolve(books);
          } else {
            resolve([]);
          }
          
          document.head.removeChild(script);
          delete window[callbackName];
        } catch (error) {
          reject(error);
        }
      };
      
      const script = document.createElement('script');
      script.src = `https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${aladinApiKey}&Query=${encodeURIComponent(query)}&QueryType=Title&MaxResults=20&start=1&SearchTarget=Book&output=js&Version=20131101&Cover=Big&Callback=${callbackName}`;
      
      script.onerror = () => {
        document.head.removeChild(script);
        delete window[callbackName];
        reject(new Error('JSONP 로드 실패'));
      };
      
      script.onload = () => {
        setTimeout(() => {
          if (window[callbackName]) {
            document.head.removeChild(script);
            delete window[callbackName];
            reject(new Error('JSONP 타임아웃'));
          }
        }, 10000);
      };
      
      document.head.appendChild(script);
    });
  }, []);

  // 검색어 변경 시 자동 검색 (디바운싱)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery && showBookSearch && searchQuery.length >= 2) {
        searchBooks(searchQuery);
      } else if (searchQuery.length < 2) {
        setSearchResults([]);
      }
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, showBookSearch, searchBooks]);

  // 타이머 관리
  useEffect(() => {
    if (isTimerRunning) {
      intervalRef.current = setInterval(() => {
        setTimerValue(prev => {
          if (timerMode === 'timer' && prev <= 1) {
            setIsTimerRunning(false);
            setShowPageInput(true);
            return 0;
          }
          return timerMode === 'stopwatch' ? prev + 1 : prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    
    return () => clearInterval(intervalRef.current);
  }, [isTimerRunning, timerMode]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (timerMode === 'timer' && timerValue === 0) {
      setTimerValue(timerInput * 60);
    }
    setIsTimerRunning(true);
  };

  const pauseTimer = () => setIsTimerRunning(false);
  
  const stopTimer = () => {
    setIsTimerRunning(false);
    setShowPageInput(true);
    if (timerMode === 'timer') {
      setTimerValue(timerInput * 60);
    }
  };

  const saveReadingSession = () => {
    const pagesRead = parseInt(pageInput) || 0;
    const newCurrentPage = Math.min(currentBook.currentPage + pagesRead, currentBook.totalPages);
    const sessionMinutes = Math.floor(timerValue / 60);
    
    // 오늘 독서했으면 연속일수 업데이트
    const today = new Date().toDateString();
    if (lastReadDate !== today) {
      setStreakDays(prev => prev + 1);
      setLastReadDate(today);
    }
    
    // 독서 세션 기록
    const newSession = {
      date: today,
      pages: pagesRead,
      minutes: timerMode === 'stopwatch' ? sessionMinutes : timerInput
    };
    
    setCurrentBook(prev => ({
      ...prev,
      currentPage: newCurrentPage,
      readingSessions: [newSession, ...prev.readingSessions]
    }));
    
    setPageInput('');
    setShowPageInput(false);
    setTimerValue(0);
    
    // 책 완독 체크
    if (newCurrentPage >= currentBook.totalPages) {
      setTimeout(() => completeBook(), 500);
    }
  };

  const addSentence = () => {
    if (newSentence.trim()) {
      setCurrentBook(prev => ({
        ...prev,
        sentences: [...prev.sentences, newSentence.trim()]
      }));
      setNewSentence('');
      setShowSentenceInput(false);
    }
  };

  const completeBook = () => {
    const bookToComplete = {
      ...currentBook,
      aiSummary: `${currentBook.title}은(는) ${currentBook.author}의 대표작으로, 총 ${currentBook.readingSessions.length}일에 걸쳐 완독하셨습니다. 기록하신 ${currentBook.sentences.length}개의 인상적인 문장들을 통해 볼 때, 깊이 있는 독서를 하셨음을 알 수 있습니다.`,
      completedDate: new Date().toDateString(),
      readingDays: currentBook.readingSessions.length
    };
    
    setCompletedBooks(prev => [bookToComplete, ...prev]);
    
    if (upcomingBooks.length > 0) {
      const nextBook = upcomingBooks[0];
      setCurrentBook({
        ...nextBook,
        currentPage: 0,
        sentences: [],
        readingSessions: []
      });
      setUpcomingBooks(prev => prev.slice(1));
    } else {
      setCurrentBook(null);
    }
    
    alert('🎉 축하합니다! 책을 완독하셨습니다. 책장에서 AI 독서록을 확인해주세요.');
  };

  // 검색된 책을 선택하여 추가
  const selectBookFromSearch = (book) => {
    const bookToAdd = {
      id: Date.now(),
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      totalPages: book.totalPages,
      cover: book.cover,
      isbn: book.isbn,
      description: book.description
    };
    
    if (currentBook) {
      setUpcomingBooks(prev => [...prev, bookToAdd]);
      alert(`📚 "${book.title}"이(가) 읽을 예정인 책에 추가되었습니다!`);
    } else {
      setCurrentBook({
        ...bookToAdd,
        currentPage: 0,
        sentences: [],
        readingSessions: []
      });
      alert(`📖 "${book.title}"을(를) 읽기 시작했습니다!`);
    }
    
    setShowBookSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  // 바코드 스캔 시뮬레이션
  const simulateBarcodeSearch = async () => {
    setIsSearching(true);
    
    try {
      const koreanBooks = [
        { title: '데미안', author: '헤르만 헤세', publisher: '민음사', pages: 234, cover: 'https://image.aladin.co.kr/product/1/55/letslook/8937460777_f.jpg', isbn: '9788937460777' },
        { title: '82년생 김지영', author: '조남주', publisher: '민음사', pages: 136, cover: 'https://image.aladin.co.kr/product/9473/50/letslook/8937473500_f.jpg', isbn: '9788937473500' },
        { title: '채식주의자', author: '한강', publisher: '창비', pages: 184, cover: 'https://image.aladin.co.kr/product/4702/41/letslook/8936470248_f.jpg', isbn: '9788936470241' },
        { title: '아몬드', author: '손원평', publisher: '창비', pages: 267, cover: 'https://image.aladin.co.kr/product/4342/67/letslook/8936434268_f.jpg', isbn: '9788936434267' }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const randomBook = koreanBooks[Math.floor(Math.random() * koreanBooks.length)];
      const book = {
        id: randomBook.isbn,
        title: randomBook.title,
        author: randomBook.author,
        publisher: randomBook.publisher,
        totalPages: randomBook.pages,
        cover: randomBook.cover,
        isbn: randomBook.isbn,
        description: '바코드 스캔으로 검색된 도서입니다.'
      };
      
      selectBookFromSearch(book);
      
    } catch (error) {
      console.error('바코드 검색 오류:', error);
      alert('바코드 스캔 중 오류가 발생했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  const ReadingStreakVisualization = () => {
    const generateReadingDays = () => {
      const days = [];
      const today = new Date();
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const isReadingDay = i < streakDays;
        
        days.push({
          date: date,
          isRead: isReadingDay,
          dayOfWeek: date.getDay(),
          dateString: date.toDateString()
        });
      }
      return days;
    };

    const readingDays = generateReadingDays();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    
    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
            {streakDays}일 연속
          </div>
          <div className="text-sm text-gray-600">독서 연속일을 이어가고 있어요! 🔥</div>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">지난 30일 독서 기록</h3>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekdays.map((day, index) => (
              <div key={index} className="text-center text-xs text-gray-500 font-medium p-1">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: readingDays[0]?.dayOfWeek || 0 }).map((_, index) => (
              <div key={`empty-${index}`} className="w-8 h-8"></div>
            ))}
            
            {readingDays.map((day, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                  day.isRead
                    ? 'bg-green-500 text-white shadow-md transform scale-110'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
                title={`${day.date.getMonth() + 1}/${day.date.getDate()} ${day.isRead ? '독서함' : '독서 안함'}`}
              >
                {day.date.getDate()}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600 mb-1">{streakDays}</div>
            <div className="text-xs text-gray-600">현재 연속일</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {Math.max(streakDays, 0)}
            </div>
            <div className="text-xs text-gray-600">최고 기록</div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-white bg-opacity-70 rounded-xl text-center">
          <div className="text-sm text-gray-700">
            {streakDays === 0 ? (
              <span>오늘부터 새로운 독서 여정을 시작해보세요! 📚</span>
            ) : streakDays < 7 ? (
              <span>좋은 시작이에요! 일주일 연속을 목표로 해봐요 🎯</span>
            ) : streakDays < 30 ? (
              <span>대단해요! 한 달 연속 독서까지 {30 - streakDays}일 남았어요 ⭐</span>
            ) : streakDays < 100 ? (
              <span>놀라워요! 100일 연속까지 {100 - streakDays}일 남았어요 🏆</span>
            ) : (
              <span>독서 마스터! 정말 대단한 기록이에요 👑</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const TimerSection = () => (
    <div className="bg-white rounded-xl p-6 shadow-lg border">
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => {
            setTimerMode('stopwatch');
            setTimerValue(0);
            setIsTimerRunning(false);
          }}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
            timerMode === 'stopwatch' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Clock size={20} />
          <span>스톱워치</span>
        </button>
        <button
          onClick={() => {
            setTimerMode('timer');
            setTimerValue(timerInput * 60);
            setIsTimerRunning(false);
          }}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
            timerMode === 'timer' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Timer size={20} />
          <span>타이머</span>
        </button>
      </div>
      
      {timerMode === 'timer' && !isTimerRunning && timerValue === timerInput * 60 && (
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center space-x-2">
            <button 
              onClick={() => setTimerInput(Math.max(1, timerInput - 5))}
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300"
            >
              -
            </button>
            <div className="px-4 py-2 bg-gray-50 rounded-lg min-w-16 text-center">
              <span className="text-lg font-semibold">{timerInput}</span>
              <span className="text-sm text-gray-500 ml-1">분</span>
            </div>
            <button 
              onClick={() => setTimerInput(Math.min(120, timerInput + 5))}
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300"
            >
              +
            </button>
          </div>
        </div>
      )}
      
      <div className="text-center mb-6">
        <div className="text-5xl font-mono text-gray-800 mb-2 tracking-wider">
          {formatTime(timerValue)}
        </div>
        <div className="text-sm text-gray-500">
          {timerMode === 'stopwatch' ? '경과 시간' : '남은 시간'}
        </div>
      </div>
      
      <div className="flex justify-center space-x-3">
        {!isTimerRunning ? (
          <button
            onClick={startTimer}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl flex items-center space-x-2 shadow-lg transition-all transform hover:scale-105"
          >
            <Play size={20} />
            <span>시작</span>
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-xl flex items-center space-x-2 shadow-lg transition-all transform hover:scale-105"
          >
            <Pause size={20} />
            <span>일시정지</span>
          </button>
        )}
        
        <button
          onClick={stopTimer}
          className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl flex items-center space-x-2 shadow-lg transition-all transform hover:scale-105"
        >
          <Square size={20} />
          <span>종료</span>
        </button>
      </div>
    </div>
  );

  const BookCard = ({ book, type, onClick }) => (
    <div 
      className="bg-white rounded-xl p-4 shadow-md border hover:shadow-lg transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <img 
          src={book.cover} 
          alt={book.title}
          className="w-16 h-24 object-cover rounded-lg shadow-sm"
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/128x192/4F46E5/FFFFFF?text=${encodeURIComponent(book.title.slice(0, 2))}`;
          }}
        />
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-800 mb-1">{book.title}</h3>
          <p className="text-gray-600 text-sm mb-1">{book.author}</p>
          <p className="text-gray-500 text-sm mb-2">{book.publisher}</p>
          
          {type === 'current' && (
            <>
              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>진행도</span>
                  <span>{book.currentPage}/{book.totalPages}쪽 ({Math.round((book.currentPage / book.totalPages) * 100)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(book.currentPage / book.totalPages) * 100}%` }}
                  />
                </div>
              </div>
              
              {book.currentPage >= book.totalPages && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    completeBook();
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors shadow-md animate-pulse"
                >
                  🎉 완독!
                </button>
              )}
            </>
          )}
          
          {type === 'upcoming' && (
            <div className="text-sm text-gray-500">
              총 {book.totalPages}쪽
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const MainView = () => (
    <div className="space-y-6">
      <ReadingStreakVisualization />
      
      {/* 독서 통계 카드 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
          <div className="text-2xl font-bold text-blue-600">{completedBooks.length}</div>
          <div className="text-xs text-gray-600">완독한 책</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
          <div className="text-2xl font-bold text-green-600">{streakDays}</div>
          <div className="text-xs text-gray-600">연속 일수</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
          <div className="text-2xl font-bold text-purple-600">
            {currentBook ? currentBook.sentences.length : 0}
          </div>
          <div className="text-xs text-gray-600">기록한 문장</div>
        </div>
      </div>
      
      {currentBook && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-center mb-4 flex items-center justify-center space-x-2">
            <BookOpen className="text-blue-500" size={24} />
            <span>읽는 중인 책</span>
          </h2>
          <BookCard 
            book={currentBook} 
            type="current" 
            onClick={() => {}}
          />
          <TimerSection />
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowSentenceInput(true)}
              className="bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all transform hover:scale-105"
            >
              <Edit3 size={20} />
              <span>문장 기록</span>
            </button>
            <button
              onClick={() => setShowPageInput(true)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all transform hover:scale-105"
            >
              <BookOpen size={20} />
              <span>진행도 기록</span>
            </button>
          </div>
        </div>
      )}
      
      {upcomingBooks.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-center mb-4 flex items-center justify-center space-x-2">
            <BookOpen className="text-orange-500" size={24} />
            <span>읽을 예정인 책</span>
          </h2>
          <div className="space-y-3">
            {upcomingBooks.map((book, index) => (
              <BookCard 
                key={book.id} 
                book={book} 
                type="upcoming" 
                onClick={() => {}}
              />
            ))}
          </div>
        </div>
      )}
      
      <button
        onClick={() => setShowAddBook(true)}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-all transform hover:scale-105"
      >
        <Plus size={24} />
        <span className="font-semibold">새 책 추가하기</span>
      </button>
    </div>
  );

  const BookshelfView = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center flex items-center justify-center space-x-2">
        <Trophy className="text-yellow-500" size={28} />
        <span>내 책장</span>
      </h1>
      
      {completedBooks.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {completedBooks.length}권 완독
            </div>
            <div className="text-sm text-gray-600 mt-1">
              총 {completedBooks.reduce((sum, book) => sum + book.totalPages, 0)}쪽 읽음
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {completedBooks.map((book, index) => (
          <div key={book.id} className="bg-white rounded-xl p-5 shadow-md border">
            <div className="flex items-start space-x-4 mb-4">
              <img 
                src={book.cover} 
                alt={book.title}
                className="w-20 h-30 object-cover rounded-lg shadow-sm"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/160x240/4F46E5/FFFFFF?text=${encodeURIComponent(book.title.slice(0, 2))}`;
                }}
              />
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800 mb-1">{book.title}</h3>
                <p className="text-gray-600 text-sm mb-1">{book.author}</p>
                <p className="text-gray-500 text-sm mb-2">{book.publisher}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>📅 {book.completedDate}</span>
                  <span>📚 {book.totalPages}쪽</span>
                  <span>⏱️ {book.readingDays}일</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">🤖</div>
                  <span>AI 독서록</span>
                </h4>
                <p className="text-sm text-blue-700 leading-relaxed">{book.aiSummary}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 flex items-center space-x-2">
                  <Heart size={18} className="text-red-500" />
                  <span>기록한 문장들 ({book.sentences.length}개)</span>
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {book.sentences.map((sentence, sentenceIndex) => (
                    <div key={sentenceIndex} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Star size={14} className="text-yellow-500 mt-1 flex-shrink-0" />
                      <p className="text-sm text-gray-700 leading-relaxed flex-1">{sentence}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {completedBooks.length === 0 && (
        <div className="text-center text-gray-500 py-16">
          <BookOpen size={64} className="mx-auto mb-6 opacity-30" />
          <p className="text-lg mb-2">아직 완독한 책이 없습니다</p>
          <p className="text-sm">첫 번째 책을 완독해보세요!</p>
        </div>
      )}
    </div>
  );

  // 페이지 입력 모달
  const PageInputModal = () => (
    showPageInput && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <h3 className="text-lg font-bold mb-4 text-center">📖 독서 진행도 기록</h3>
          
          <div className="mb-4 text-center text-sm text-gray-600">
            <p>오늘 몇 쪽을 읽으셨나요?</p>
            <p className="text-blue-600 font-semibold mt-1">
              현재: {currentBook?.currentPage}쪽 / {currentBook?.totalPages}쪽
            </p>
          </div>
          
          <div className="mb-6">
            <input
              type="number"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              placeholder="읽은 페이지 수"
              className="w-full p-4 border rounded-xl text-center text-lg font-semibold"
              min="0"
              max={currentBook ? currentBook.totalPages - currentBook.currentPage : 999}
              autoFocus
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowPageInput(false)}
              className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold"
            >
              취소
            </button>
            <button
              onClick={saveReadingSession}
              className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
              disabled={!pageInput || parseInt(pageInput) <= 0}
            >
              기록하기
            </button>
          </div>
        </div>
      </div>
    )
  );

  // 문장 입력 모달
  const SentenceInputModal = () => (
    showSentenceInput && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-bold mb-4 text-center">✨ 인상깊은 문장 기록</h3>
          
          <div className="space-y-3 mb-6">
            <button className="w-full p-4 bg-blue-50 hover:bg-blue-100 rounded-xl flex items-center space-x-3 border border-blue-200 transition-colors">
              <Camera size={24} className="text-blue-600" />
              <div className="text-left flex-1">
                <div className="font-semibold text-blue-800">카메라로 촬영</div>
                <div className="text-sm text-blue-600">OCR로 텍스트 인식</div>
              </div>
            </button>
            <button className="w-full p-4 bg-green-50 hover:bg-green-100 rounded-xl flex items-center space-x-3 border border-green-200 transition-colors">
              <Search size={24} className="text-green-600" />
              <div className="text-left flex-1">
                <div className="font-semibold text-green-800">갤러리에서 선택</div>
                <div className="text-sm text-green-600">저장된 이미지 불러오기</div>
              </div>
            </button>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">직접 입력하기</label>
            <textarea
              value={newSentence}
              onChange={(e) => setNewSentence(e.target.value)}
              placeholder="기억하고 싶은 문장을 입력해주세요..."
              className="w-full p-4 border rounded-xl h-32 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowSentenceInput(false)}
              className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              취소
            </button>
            <button
              onClick={addSentence}
              className="flex-1 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition-colors disabled:opacity-50"
              disabled={!newSentence.trim()}
            >
              저장하기
            </button>
          </div>
        </div>
      </div>
    )
  );

  // 도서 검색 모달
  const BookSearchModal = () => (
    showBookSearch && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] flex flex-col">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">📚 알라딘 도서 검색</h3>
              <button
                onClick={() => {
                  setShowBookSearch(false);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="mt-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="책 제목, 저자명, 출판사를 입력하세요... (2글자 이상)"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              {searchQuery.length > 0 && searchQuery.length < 2 && (
                <div className="text-xs text-orange-600 mt-1">
                  ⚠️ 검색어를 2글자 이상 입력해주세요
                </div>
              )}
              <div className="text-xs text-gray-500 mt-2">
                💡 알라딘 도서 데이터베이스에서 실시간 검색
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {isSearching ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600">검색 중...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-3">
                {searchResults.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => selectBookFromSearch(book)}
                    className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-12 h-18 object-cover rounded shadow-sm flex-shrink-0"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/96x144/4F46E5/FFFFFF?text=${encodeURIComponent(book.title.slice(0, 2))}`;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-800 truncate">
                        {book.title}
                      </h4>
                      <p className="text-xs text-gray-600 truncate">{book.author}</p>
                      <p className="text-xs text-gray-500 truncate">{book.publisher}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          {book.totalPages}쪽
                        </span>
                        {book.publishedDate && (
                          <span className="text-xs text-gray-500">
                            {book.publishedDate.slice(0, 4)}년
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchQuery && !isSearching && searchQuery.length >= 2 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
                <p className="font-medium">"{searchQuery}"에 대한 검색 결과가 없습니다.</p>
                <div className="text-sm mt-3 space-y-2 text-left bg-blue-50 p-4 rounded-lg">
                  <p className="font-semibold text-blue-800 mb-2">💡 검색 팁:</p>
                  <div className="text-blue-600 space-y-1">
                    <p>• 띄어쓰기 없이 검색해보세요 (예: "82년생김지영")</p>
                    <p>• 저자명으로 검색해보세요 (예: "한강", "조남주")</p>
                    <p>• 시리즈명으로 검색해보세요 (예: "해리포터")</p>
                    <p>• 카테고리로 검색해보세요 (예: "프로그래밍", "소설")</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Search size={48} className="mx-auto mb-4 opacity-30" />
                <p>📚 알라딘 도서 검색</p>
                <p className="text-sm mt-2">한국 최대 온라인 서점의 모든 도서를 검색하세요!</p>
                <div className="text-xs text-blue-600 mt-3 bg-blue-50 p-3 rounded-lg">
                  <p className="font-semibold mb-1">💡 인기 검색어:</p>
                  <p>"82년생 김지영", "채식주의자", "데미안", "미움받을 용기"</p>
                  <p>"프로그래밍", "자기계발", "소설", "에세이"</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );

  // 책 추가 모달
  const AddBookModal = () => (
    showAddBook && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <h3 className="text-lg font-bold mb-4 text-center">📚 새 책 추가</h3>
          
          <div className="space-y-3 mb-6">
            <button 
              onClick={() => {
                setShowAddBook(false);
                setShowBookSearch(true);
              }}
              className="w-full p-4 bg-blue-50 hover:bg-blue-100 rounded-xl flex items-center space-x-3 border border-blue-200 transition-colors"
            >
              <Search size={24} className="text-blue-600" />
              <div className="text-left flex-1">
                <div className="font-semibold text-blue-800">알라딘에서 검색</div>
                <div className="text-sm text-blue-600">한국 최대 서점의 모든 도서 검색</div>
              </div>
            </button>
            <button 
              onClick={() => {
                setShowAddBook(false);
                simulateBarcodeSearch();
              }}
              disabled={isSearching}
              className="w-full p-4 bg-green-50 hover:bg-green-100 rounded-xl flex items-center space-x-3 border border-green-200 transition-colors disabled:opacity-50"
            >
              <Camera size={24} className="text-green-600" />
              <div className="text-left flex-1">
                <div className="font-semibold text-green-800">바코드 스캔</div>
                <div className="text-sm text-green-600">
                  {isSearching ? '스캔 중...' : '한국 도서 ISBN으로 정확한 정보'}
                </div>
              </div>
            </button>
          </div>
          
          <div className="text-center text-gray-500 text-sm mb-4">또는 직접 입력</div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">책 제목 *</label>
              <input
                value={newBook.title}
                onChange={(e) => setNewBook(prev => ({ ...prev, title: e.target.value }))}
                placeholder="예: 데미안"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">저자 *</label>
              <input
                value={newBook.author}
                onChange={(e) => setNewBook(prev => ({ ...prev, author: e.target.value }))}
                placeholder="예: 헤르만 헤세"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">출판사</label>
              <input
                value={newBook.publisher}
                onChange={(e) => setNewBook(prev => ({ ...prev, publisher: e.target.value }))}
                placeholder="예: 민음사"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">총 페이지 수</label>
              <input
                type="number"
                value={newBook.totalPages}
                onChange={(e) => setNewBook(prev => ({ ...prev, totalPages: e.target.value }))}
                placeholder="예: 234"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="1"
              />
            </div>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <button
              onClick={() => {
                setShowAddBook(false);
                setNewBook({ title: '', author: '', publisher: '', totalPages: '' });
              }}
              className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              취소
            </button>
            <button
              onClick={() => {
                if (newBook.title && newBook.author) {
                  const bookToAdd = {
                    id: Date.now(),
                    ...newBook,
                    totalPages: parseInt(newBook.totalPages) || 200,
                    cover: `https://via.placeholder.com/128x192/4F46E5/FFFFFF?text=${encodeURIComponent(newBook.title.slice(0, 2))}`
                  };
                  
                  if (currentBook) {
                    setUpcomingBooks(prev => [...prev, bookToAdd]);
                  } else {
                    setCurrentBook({
                      ...bookToAdd,
                      currentPage: 0,
                      sentences: [],
                      readingSessions: []
                    });
                  }
                  
                  setNewBook({ title: '', author: '', publisher: '', totalPages: '' });
                  setShowAddBook(false);
                  alert(`📚 "${bookToAdd.title}"이(가) 추가되었습니다!`);
                }
              }}
              className="flex-1 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
              disabled={!newBook.title || !newBook.author}
            >
              추가하기
            </button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl relative">
        <div className="p-4 pb-24">
          {currentView === 'main' ? <MainView /> : <BookshelfView />}
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
        
        <PageInputModal />
        <SentenceInputModal />
        <AddBookModal />
        <BookSearchModal />
      </div>
    </div>
  );
};

export default ReadingTrackerApp;