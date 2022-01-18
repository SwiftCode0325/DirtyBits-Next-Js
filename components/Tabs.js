import { connect, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import ReactHtmlParser from "react-html-parser";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import SmoothList from "react-smooth-list";
import { BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs";
import { IoPlayBackOutline } from "react-icons/io5";

import {
  AiOutlineDislike,
  AiOutlineLike,
  AiFillSignal,
  AiFillLike,
  AiFillDislike,
  AiOutlineGlobal,
} from "react-icons/ai";
import IoTable from "./ProblemPage/IoTable";
import Submissions from "./ProblemPage/submission";
import {
  bookmarkStatusHandler,
  upvoteHandler,
  downvoteHandler,
} from "../redux/actions/ProblemPage";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function BasicTabs(props) {
  const dispatch = useDispatch();

  const [inputTestCases, setInputTestCases] = useState([]);
  const [outputTestCases, setOutputTestCases] = useState([]);

  const handleChange = (_, newValue) => {
    props.currentTabFunction(newValue);
  };

  console.log("tabs currentTabvalue", props.currentTabValue);
  let level;
  let color;
  switch (props.questionData.problem_level) {
    case "E":
      level = "Easy";
      color = "bg-green-600";
      break;
    case "M":
      level = "Medium";
      color = "bg-yellow-600";
      break;
    case "H":
      level = "Hard";
      color = "bg-red-600";
      break;
  }

  const GetInputTestCases = async () => {
    var inputTestCases = [];
    for (let i = 1; i <= props.questionData.sample_Tc; i++) {
      const result = fetch(
        `https://res.cloudinary.com/hhikcz56h/raw/upload/v1636969572/TestCases/${props.questionData.id}/sc-input${i}.txt`
      ).then((response) => {
        return response.text();
      });
      await result.then((response) => {
        inputTestCases.push(response);
      });
    }
    setInputTestCases(inputTestCases);
    return;
  };

  const GetOutputTestCases = async () => {
    var outputTestCases = [];
    for (let i = 1; i <= props.questionData.sample_Tc; i++) {
      const result = fetch(
        `https://res.cloudinary.com/hhikcz56h/raw/upload/v1636969572/TestCases/${props.questionData.id}/sc-output${i}.txt`
      ).then((response) => {
        return response.text();
      });
      await result.then((response) => {
        outputTestCases.push(response);
      });
    }
    setOutputTestCases(outputTestCases);
    return;
  };

  const getTestCases = () => {
    GetInputTestCases();
    GetOutputTestCases();
  };

  useEffect(() => {
    getTestCases();
  }, []);

  return (
    <Box sx={{ width: "100%", height: "100vh" }} className="scrollbar-hide">
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={props.currentTabValue}
          textColor="inherit"
          indicatorColor="secondary"
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Problem" {...a11yProps(0)} />
          <Tab
            label={`Submissions ${props.userSubmissions}`}
            {...a11yProps(1)}
          />
          <Tab label="Discussion" {...a11yProps(2)} />
          <Tab label="Editorial" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={props.currentTabValue} index={0}>
        <div className="space-y-5 transition-all ease-in-out">
          {/* PROBLEM TITLE */}
          <SmoothList>
            <div className="flex items-center gap-2 group">
              <a
                href="/problemset"
                className="login-btn text-black group-hover:text-white bg-white flex items-center gap-2"
              >
                <IoPlayBackOutline className="text-base" />
                <span>Problem Set</span>
              </a>
            </div>
          </SmoothList>

          <SmoothList>
            <div className="font-medium text-lg text-[#a1acc0]">
              <div className="flex items-center space-x-3">
                <span>{props.questionData.id}. </span>
                <div>{props.questionData.title}</div>
                {/* BOOKMARK */}
                <div
                  onClick={() => {
                    dispatch(bookmarkStatusHandler());
                  }}
                  className="inline-block cursor-pointer"
                >
                  {props.isBookmarkSet ? (
                    <BsBookmarkCheckFill className="text-lg" />
                  ) : (
                    <BsBookmarkCheck className="text-lg" />
                  )}
                </div>
              </div>
            </div>
          </SmoothList>

          {/* PROBLEM DIFFICULTY */}

          <div className="flex items-center space-x-5">
            <p className={`${color} text-sm inline px-3 py-1 rounded-xl`}>
              {level}
            </p>

            <div
              onClick={() => {
                dispatch(upvoteHandler());
              }}
              className="flex items-center space-x-1 cursor-pointer"
            >
              <p>{props.isUpVoted ? <AiFillLike /> : <AiOutlineLike />}</p>
              <p className="text-xs">{props.upVote}</p>
            </div>

            <div
              onClick={() => {
                dispatch(downvoteHandler());
              }}
              className="flex items-center space-x-1 cursor-pointer"
            >
              <p>
                {props.isDownVoted ? <AiFillDislike /> : <AiOutlineDislike />}
              </p>
              <p className="text-xs">{props.downVote}</p>
            </div>

            <div className="flex items-center space-x-1">
              <p>
                <AiFillSignal />
              </p>
              <p className="text-xs">
                Accuracy. {props.questionData.accuracy}%
              </p>
            </div>

            <div className="flex items-center space-x-1">
              <p>
                <AiOutlineGlobal />
              </p>
              <p className="text-xs">
                Total Submissions. {props.questionData.totalSubmissions}
              </p>
            </div>
          </div>

          {/* PROBLEM DESCRIPTION */}
          <SmoothList>
            <div className="">
              {props.questionData.problem_statement &&
                ReactHtmlParser(props.questionData.problem_statement)}
            </div>
          </SmoothList>

          {/* PROBLEM NOTE IF ANY */}
          {props.questionData.note && <p>Note: {props.questionData.note}</p>}

          {/* INPUT FORMAT */}
          <h2 className="text-white">Input Format</h2>
          <pre>
            {props.questionData.input_format &&
              ReactHtmlParser(props.questionData.input_format)}
          </pre>

          {/* OUTPUT FORMAT */}
          <h2 className="text-white">Output Format</h2>
          <pre>
            {props.questionData.output_format &&
              ReactHtmlParser(props.questionData.output_format)}
          </pre>

          {/* SAMEPLE INPUT TEST CASES */}
          <SmoothList>
            <h2 className="text-white">Sample Test Cases</h2>
            {inputTestCases.length > 0 &&
              inputTestCases.map((val, idx) => (
                <IoTable
                  key={idx}
                  inputData={val}
                  outputData={outputTestCases[idx]}
                />
              ))}
          </SmoothList>

          {/* CONSTRAINTS */}
          <SmoothList>
            <h2 className="text-white">Constraints:</h2>
            <pre>
              {props.questionData.constraints &&
                ReactHtmlParser(props.questionData.constraints)}
            </pre>
            <pre>Memory Limit: {props.questionData.memory_Limit} KB</pre>
            <pre>Time Limit: {props.questionData.time_Limit}s</pre>
          </SmoothList>
        </div>
      </TabPanel>
      <TabPanel value={props.currentTabValue} index={1}>
        <Submissions
          isRunning={props.codeRunner}
          result={props.submissionData}
        />
      </TabPanel>
      <TabPanel value={props.currentTabValue} index={2}>
        Editorial
      </TabPanel>
      <TabPanel value={props.currentTabValue} index={3}>
        Discussion
      </TabPanel>
    </Box>
  );
}

const mapStateToProps = (state) => {
  return {
    userSubmissions: state.submissionCount,
    questionData: state.problemData,
    isBookmarkSet: state.isBookmarked,
    upVote: state.upvoteCount,
    downVote: state.downvoteCount,
    isUpVoted: state.isUpvoted,
    isDownVoted: state.isDownvoted,
  };
};

export default connect(mapStateToProps)(BasicTabs);
