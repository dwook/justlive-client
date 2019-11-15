import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import useForm from 'react-hook-form';
import Calendar from 'react-calendar';
import dayjs from 'dayjs';
import './Booking.scss';
import Finish from '../Finish/Finish';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import dotenv from 'dotenv';
dotenv.config();
const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL;
const branchList = ['서강', '신촌', '이화', '연대'];

async function loadSlot(date = new Date(), branch) {
  const dt = new Date(date);
  console.log('dt', dt);
  const day = dt.getDay();
  const isWeekend = day === 6 || day === 0;

  let bookingList = [];

  console.log('보내는 값', date, branch);
  await axios
    .get(`${REACT_APP_SERVER_URL}/api/bookings`, {
      params: {
        branch: branch,
        begin: date,
        end: date
      }
    })
    .then(data => {
      bookingList = data.data.bookings.map(booking => booking.tour_date);
      console.log('예약된 리스트', bookingList);
    });

  if (!isWeekend) {
    let slotList = [];
    const dateWeek = dayjs(dt).format('YYYY-MM-DD');
    let startDateWeek = dayjs(dateWeek).set('hour', 10);
    for (let i = 0; i < 18; i++) {
      slotList.push(startDateWeek.add(30 * i, 'minute'));
    }
    const filteredList = slotList.filter(
      slot => !bookingList.includes(slot.toISOString())
    );
    console.log('평일', slotList);
    console.log('평일필터', filteredList);
    return filteredList;
  } else {
    let slotList = [];
    const dateWeekend = dayjs(dt).format('YYYY-MM-DD');
    let startDateWeekend = dayjs(dateWeekend).set('hour', 11);
    for (let i = 0; i < 8; i++) {
      slotList.push(startDateWeekend.add(30 * i, 'minute'));
    }
    const filteredList = slotList.filter(
      slot => !bookingList.includes(slot.toISOString())
    );
    console.log('주말', slotList);
    console.log('주말필터', filteredList);
    return filteredList;
  }
}

function Navigation({ step, onPrevClick, onNextClick }) {
  return (
    <div className="navigation">
      {step >= 2 && (
        <span className="button-prev" onClick={onPrevClick}>
          <FiChevronLeft />
        </span>
      )}
      <span className="current">{step}/4</span>
      {step < 4 && (
        <span className="button-next" onClick={onNextClick}>
          <FiChevronRight />
        </span>
      )}
      {step === 4 && <input type="submit" value="투어예약" />}
    </div>
  );
}

function Booking() {
  const [slotList, setSlotList] = useState([]);
  const [selectedDate, setDate] = useState(new Date());
  const [selectedTime, setTime] = useState(null);
  const [selectedMoveDate, setMoveDate] = useState(null);
  const [selectedBranch, setBranch] = useState(null);
  const [mobile, setMobile] = useState('');
  const [step, setStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(null);

  const { register, setValue, handleSubmit, errors } = useForm({
    validateCriteriaMode: 'all'
  });
  useEffect(() => {
    // eslint-disable-next-line
  }, []);
  const onSubmit = data => {
    console.log(data);
    axios
      .post(`${REACT_APP_SERVER_URL}/api/bookings`, { data })
      .then(data => console.log('돌아온데이터', data.data));
    setIsCompleted(true);
  };
  console.log('에러', errors);
  const onBranchClick = async value => {
    setBranch(value);
    console.log(value);
    const data = await loadSlot(selectedDate, value);
    setSlotList(data);
    console.log('list', slotList);
  };
  const onDateClick = async value => {
    setDate(value);
    const data = await loadSlot(value, selectedBranch);
    setSlotList(data);
    console.log(value);
  };
  const onTimeClick = value => {
    setTime(value);
    console.log(value);
    setValue('tour_date', value);
  };
  const onMoveDateClick = value => {
    setMoveDate(value);
    console.log(value);
  };

  const onPrevClick = () => {
    setStep(step - 1);
    if (step === 2) setBranch(null);
    if (step === 3) setTime(null);
  };
  const onNextClick = () => {
    setStep(step + 1);
  };

  return (
    <>
      {!isCompleted && (
        <div className="form-wrapper">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-summary">
              <div className="content">
                <span>{selectedBranch && `${selectedBranch}점`}</span>
                <span>
                  {selectedTime &&
                    dayjs(selectedTime).format('YY년 MM월 DD일 HH:mm 타임')}
                </span>
              </div>
              <Link to="/">
                <span className="button-close">
                  <FiX />
                </span>
              </Link>
            </div>

            <div className={`form-group ${step === 1 ? 'active' : ''}`}>
              <h2>투어예약을 위한 정보를 입력해주세요.</h2>
              <div className="row">
                <div className="title">이름</div>
                <div className="form">
                  <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    ref={register({ required: true })}
                  />
                  <p className="error">
                    {errors.name && '이름을 입력해주세요!'}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="title">이메일</div>
                <div className="form">
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    ref={register({ required: true, pattern: /^\S+@\S+$/i })}
                  />
                  <p className="error">
                    {errors.email &&
                      '이메일 양식을 지켜서 필수로 입력해주세요!'}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="title">휴대폰</div>
                <div className="form">
                  <input
                    type="tel"
                    placeholder="'-'제외하고, 숫자만 입력해주세요."
                    name="mobile"
                    ref={register({
                      required: true,
                      maxLength: 12,
                      pattern: /(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/i
                    })}
                    value={mobile}
                    onChange={event => {
                      if (isNaN(Number(event.target.value))) {
                        return;
                      } else {
                        setMobile(event.target.value);
                        setValue('mobile', event.target.value);
                      }
                    }}
                  />
                  <p className="error">
                    {errors.mobile && '숫자만 입력해주세요'}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="title">나이</div>
                <div className="form">
                  <input
                    type="number"
                    placeholder="Age"
                    name="age"
                    ref={register({ required: true, max: 99, maxLength: 2 })}
                  />
                </div>
              </div>
              <div className="row">
                <div className="title">성별</div>
                <div className="form">
                  <label>
                    <input
                      name="gender"
                      type="radio"
                      value="male"
                      ref={register({ required: true })}
                    />
                    남성
                  </label>

                  <label>
                    <input
                      name="gender"
                      type="radio"
                      value="female"
                      ref={register({ required: true })}
                    />
                    여성
                  </label>

                  <label>
                    <input
                      name="gender"
                      type="radio"
                      value="other"
                      ref={register({ required: true })}
                    />
                    기타
                  </label>
                </div>
              </div>
              <Navigation
                step={step}
                onPrevClick={onPrevClick}
                onNextClick={onNextClick}
              />
            </div>

            <div className={`form-group ${step === 2 ? 'active' : ''}`}>
              <h2>투어하고 싶은 지점을 선택해주세요.</h2>
              <div className="row branch">
                {/* <div className="title">
                  지점선택
                  <span className="selected"> {selectedBranch}</span>
                </div> */}
                <div className="form">
                  {branchList.map(branch => {
                    return (
                      <label
                        className={selectedBranch === branch ? 'selected' : ''}
                        onClick={() => onBranchClick(branch)}
                        key={branch}
                      >
                        <input
                          name="branch"
                          type="radio"
                          value={branch}
                          ref={register({ required: true })}
                        />
                        {branch}
                      </label>
                    );
                  })}
                </div>
              </div>
              <Navigation
                step={step}
                onPrevClick={onPrevClick}
                onNextClick={onNextClick}
              />
            </div>

            <div className={`form-group ${step === 3 ? 'active' : ''}`}>
              <h2>투어하고 싶은 타임을 선택해주세요.</h2>
              <div className="row date">
                {/* <div className="title">
                  일정선택
                  <span className="selected">
                    {selectedTime &&
                      dayjs(selectedTime).format('YY년 MM월 DD일 HH:mm 타임')}
                  </span>
                </div> */}
                <input
                  type="hidden"
                  name="tour_date"
                  ref={register({ required: true })}
                />
                <Calendar
                  onClickDay={value => {
                    onDateClick(value);
                  }}
                  minDate={new Date()}
                  value={selectedDate}
                />
                <div className="form">
                  {/* <div className="time selected">10:00</div>
              <div className="time disabled">10:30</div>
              <div className="time">11:00</div>
              <div className="time">11:30</div> */}
                  {slotList &&
                    slotList.map(slot => {
                      return (
                        <div
                          className={`time ${
                            selectedTime === slot.format() ? 'selected' : ''
                          }`}
                          key={slot.$d}
                          onClick={() => onTimeClick(slot.format())}
                        >
                          {slot.format('HH:mm')}
                        </div>
                      );
                    })}
                </div>
              </div>
              <Navigation
                step={step}
                onPrevClick={onPrevClick}
                onNextClick={onNextClick}
              />
            </div>

            <div className={`form-group ${step === 4 ? 'active' : ''}`}>
              <h2>추가정보</h2>
              <div className="row date">
                <div className="title">
                  희망입주일
                  <span className="selected">
                    {selectedMoveDate &&
                      dayjs(selectedMoveDate).format('YY년 MM월 DD일')}
                  </span>
                  <input
                    type="hidden"
                    name="desired_move_date"
                    ref={register}
                  />
                </div>
                <Calendar
                  onClickDay={value => {
                    onMoveDateClick(value);
                  }}
                  minDate={new Date()}
                />
              </div>
              <div className="row request">
                <div className="title">요청사항</div>
                <div className="form">
                  <input
                    type="text"
                    placeholder="요청할 내용이 있으면 적어주세요!"
                    name="request"
                    ref={register}
                  />
                </div>
              </div>
              <Navigation
                step={step}
                onPrevClick={onPrevClick}
                onNextClick={onNextClick}
              />
            </div>
          </form>
        </div>
      )}
      {isCompleted && (
        <div className="complete">
          <Finish />
          <div className="detail">
            <p>{selectedBranch}</p>
            <p>{dayjs(selectedTime).format('YY년 MM월 DD일 HH:mm 타임')}</p>
          </div>
          <div className="title">투어예약이 완료되었습니다.</div>
        </div>
      )}
    </>
  );
}

export default Booking;
