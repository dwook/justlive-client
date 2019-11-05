import React from 'react';
import useForm from 'react-hook-form';
import Calendar from 'react-calendar';
import './Booking.scss';

function Booking() {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = data => console.log(data);
  console.log(errors);

  return (
    <div className="section-booking">
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
                  ref={register({ required: true, pattern: /^\S+@\S+$/i })}
                />
              </div>
            </div>
            <div className="row">
              <div className="title">휴대폰</div>
              <div className="form">
                <input
                  type="tel"
                  placeholder="하이픈(-)없이, 번호만 입력해주세요."
                  name="mobile"
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
          </div>

          <div className="row branch">
            <div className="title">지점선택</div>
            <div className="form">
              <label className="selected">
                <input
                  name="branch"
                  type="radio"
                  value="서강"
                  ref={register({ required: true })}
                />
                서강
              </label>

              <label>
                <input
                  name="branch"
                  type="radio"
                  value="신촌"
                  ref={register({ required: true })}
                />
                신촌
              </label>

              <label>
                <input
                  name="branch"
                  type="radio"
                  value="이화"
                  ref={register({ required: true })}
                />
                이화
              </label>

              <label>
                <input
                  name="branch"
                  type="radio"
                  value="연대"
                  ref={register({ required: true })}
                />
                연대
              </label>
            </div>
          </div>

          <div className="row date">
            <div className="title">
              일정선택
              {/* <input
                type="date"
                placeholder="tour_date"
                name="tour_date"
                ref={register({ required: true })}
              /> */}
            </div>
            <Calendar />
            <div className="form">
              <div className="time selected">10:00</div>
              <div className="time disabled">10:30</div>
              <div className="time">11:00</div>
              <div className="time">11:30</div>
            </div>
          </div>

          <div className="row date">
            <div className="title">
              희망입주일
              {/* <input
                type="date"
                placeholder="desired_move_date"
                name="desired_move_date"
                ref={register}
              /> */}
            </div>
            <div className="form"></div>
          </div>

          <div className="row request">
            <div className="title">요청사항</div>
            <div className="form">
              <input
                type="text"
                placeholder="요청할 내용이 있으면 적어주세요!"
                name="referrer"
                ref={register}
              />
            </div>
          </div>
          <input type="submit" />
        </form>
      </div>
    </div>
  );
}

export default Booking;
