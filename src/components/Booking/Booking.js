import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useForm from 'react-hook-form';
import Calendar from 'react-calendar';
import dayjs from 'dayjs';
import './Booking.scss';
import Finish from '../Finish/Finish';

const branchList = ['서강', '신촌', '이화', '연대'];

function loadSlot(date) {
  const dt = date ? new Date(date) : new Date();
  console.log('dt', dt);
  const day = dt.getDay();
  const isWeekend = day === 6 || day === 0;
  let slotList;

  if (!isWeekend) {
    slotList = [];
    const dateWeek = dayjs(dt).format('YYYY-MM-DD');
    let startDateWeek = dayjs(dateWeek).set('hour', 10);
    for (let i = 0; i < 18; i++) {
      slotList.push(startDateWeek.add(30 * i, 'minute'));
    }
    console.log('평일', slotList);
    return slotList;
  } else {
    slotList = [];
    const dateWeekend = dayjs(dt).format('YYYY-MM-DD');
    let startDateWeekend = dayjs(dateWeekend).set('hour', 11);
    for (let i = 0; i < 8; i++) {
      slotList.push(startDateWeekend.add(30 * i, 'minute'));
    }
    console.log('주말', slotList);
    return slotList;
  }
}

function Booking() {
  const [slotList, setSlotList] = useState([]);
  const [selectedDate, setDate] = useState(new Date());
  const [selectedTime, setTime] = useState(null);
  const [selectedMoveDate, setMoveDate] = useState(null);
  const [selectedBranch, setBranch] = useState(null);
  const [isCompleted, setIsCompleted] = useState(null);

  useEffect(() => {
    const data = loadSlot();
    setSlotList(data);
    console.log('list', slotList);
    // eslint-disable-next-line
  }, []);
  const { register, setValue, handleSubmit, errors } = useForm();
  const onSubmit = data => {
    console.log(data);
    axios
      .post('http://localhost:5000/api/bookings', { data })
      .then(data => console.log('돌아온데이터', data.data));
    setIsCompleted(true);
  };
  console.log('에러', errors);
  const onDateClick = value => {
    setDate(value);
    const data = loadSlot(value);
    setSlotList(data);
    console.log(value);
  };
  const onMoveDateClick = value => {
    setMoveDate(value);
    console.log(value);
  };
  const onTimeClick = value => {
    setTime(value);
    //setSlotList(value);
    console.log(value);
    setValue('tour_date', value);
  };
  const onBranchClick = value => {
    setBranch(value);
    console.log(value);
  };

  return (
    <div className="section-booking">
      {!isCompleted && (
        <div className="form-booking">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <div className="row">
                <div className="title">이름</div>
                <div className="form">
                  <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    defaultValue="김동욱"
                    ref={register({ required: true, maxLength: 80 })}
                  />
                </div>
              </div>
              <div className="row">
                <div className="title">이메일</div>
                <div className="form">
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    defaultValue="igerapex@gmail.com"
                    ref={register({ required: true, pattern: /^\S+@\S+$/i })}
                  />
                </div>
              </div>
              <div className="row">
                <div className="title">휴대폰</div>
                <div className="form">
                  <input
                    type="tel"
                    placeholder="'-'제외하고, 숫자만 입력해주세요."
                    name="mobile"
                    defaultValue="01073345096"
                    ref={register({
                      required: true,
                      maxLength: 12,
                      pattern: /(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/i
                    })}
                  />
                </div>
              </div>
              <div className="row">
                <div className="title">나이</div>
                <div className="form">
                  <input
                    type="number"
                    placeholder="Age"
                    name="age"
                    defaultValue="21"
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
                    Male
                  </label>

                  <label>
                    <input
                      name="gender"
                      type="radio"
                      value="female"
                      defaultChecked
                      ref={register({ required: true })}
                    />
                    Female
                  </label>

                  <label>
                    <input
                      name="gender"
                      type="radio"
                      value="other"
                      ref={register({ required: true })}
                    />
                    Other
                  </label>
                </div>
              </div>
              <div className="row branch">
                <div className="title">
                  지점선택
                  <span className="selected"> {selectedBranch}</span>
                </div>
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
            </div>

            <div className="form-group">
              <div className="row date">
                <div className="title">
                  일정선택
                  <span className="selected">
                    {selectedTime &&
                      dayjs(selectedTime).format('YY년 MM월 DD일 HH:mm 타임')}
                  </span>
                  <input
                    type="hidden"
                    name="tour_date"
                    ref={register({ required: true })}
                  />
                </div>
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
            </div>

            <div className="form-group">
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
                    defaultValue="바로 입주하고 싶습니다."
                    ref={register}
                  />
                </div>
              </div>
            </div>

            <div className="form-check">
              <p>{selectedBranch && `${selectedBranch}점`}</p>
              <p>
                {selectedTime &&
                  dayjs(selectedTime).format('YY년 MM월 DD일 HH:mm 타임')}
              </p>
              <input type="submit" value="투어예약" />
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
    </div>
  );
}

export default Booking;
