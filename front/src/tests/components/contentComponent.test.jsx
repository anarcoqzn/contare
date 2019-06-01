import ContentComponent from '../../components/contentComponent/contentComponent';

it("should render correctly", () =>{
    const wrapper = shallow(
        <ContentComponent />
    );
    expect(wrapper).toMatchSnapshot();
});

