/**
 * Created by JacobJaffe on 12/21/17.
 */

function FrequencyTable()  {
    let noteFreq = [];
    for (let i=0; i< 9; i++) {
        noteFreq[i] = [];
    }

    noteFreq[0][10] = 27.500000000000000;
    noteFreq[0][11] = 29.135235094880619;
    noteFreq[0][12] = 30.867706328507756;

    noteFreq[1][1] = 32.703195662574829;
    noteFreq[1][2] = 34.647828872109012;
    noteFreq[1][3] = 36.708095989675945;
    noteFreq[1][4] = 38.890872965260113;
    noteFreq[1][5] = 41.203444614108741;
    noteFreq[1][6] = 43.653528929125485;
    noteFreq[1][7] = 46.249302838954299;
    noteFreq[1][8] = 48.999429497718661;
    noteFreq[1][9] = 51.913087197493142;
    noteFreq[1][10] = 55.000000000000000;
    noteFreq[1][11] = 58.270470189761239;
    noteFreq[1][12] = 61.735412657015513;

    noteFreq[2][1] = 65.406391325149658;
    noteFreq[2][2] = 69.295657744218024;
    noteFreq[2][3] = 73.416191979351890;
    noteFreq[2][4] = 77.781745930520227;
    noteFreq[2][5] = 82.406889228217482;
    noteFreq[2][6] = 87.307057858250971;
    noteFreq[2][7] = 92.498605677908599;
    noteFreq[2][8] = 97.998858995437323;
    noteFreq[2][9] = 103.826174394986284;
    noteFreq[2][10] = 110.000000000000000;
    noteFreq[2][11] = 116.540940379522479;
    noteFreq[2][12] = 123.470825314031027;

    noteFreq[3][1] = 130.812782650299317;
    noteFreq[3][2] = 138.591315488436048;
    noteFreq[3][3] = 146.832383958703780;
    noteFreq[3][4] = 155.563491861040455;
    noteFreq[3][5] = 164.813778456434964;
    noteFreq[3][6] = 174.614115716501942;
    noteFreq[3][7] = 184.997211355817199;
    noteFreq[3][8] = 195.997717990874647;
    noteFreq[3][9] = 207.652348789972569;
    noteFreq[3][10] = 220.000000000000000;
    noteFreq[3][11] = 233.081880759044958;
    noteFreq[3][12] = 246.941650628062055;

    noteFreq[4][1] = 261.625565300598634;
    noteFreq[4][2] = 277.182630976872096;
    noteFreq[4][3] = 293.664767917407560;
    noteFreq[4][4] = 311.126983722080910;
    noteFreq[4][5] = 329.627556912869929;
    noteFreq[4][6] = 349.228231433003884;
    noteFreq[4][7] = 369.994422711634398;
    noteFreq[4][8] = 391.995435981749294;
    noteFreq[4][9] = 415.304697579945138;
    noteFreq[4][10] = 440.000000000000000;
    noteFreq[4][11] = 466.163761518089916;
    noteFreq[4][12] = 493.883301256124111;

    noteFreq[5][1] = 523.251130601197269;
    noteFreq[5][2] = 554.365261953744192;
    noteFreq[5][3] = 587.329535834815120;
    noteFreq[5][4] = 622.253967444161821;
    noteFreq[5][5] = 659.255113825739859;
    noteFreq[5][6] = 698.456462866007768;
    noteFreq[5][7] = 739.988845423268797;
    noteFreq[5][8] = 783.990871963498588;
    noteFreq[5][9] = 830.609395159890277;
    noteFreq[5][10] = 880.000000000000000;
    noteFreq[5][11] = 932.327523036179832;
    noteFreq[5][12] = 987.766602512248223;

    noteFreq[6][1] = 1046.502261202394538;
    noteFreq[6][2] = 1108.730523907488384;
    noteFreq[6][3] = 1174.659071669630241;
    noteFreq[6][4] = 1244.507934888323642;
    noteFreq[6][5] = 1318.510227651479718;
    noteFreq[6][6] = 1396.912925732015537;
    noteFreq[6][7] = 1479.977690846537595;
    noteFreq[6][8] = 1567.981743926997176;
    noteFreq[6][9] = 1661.218790319780554;
    noteFreq[6][10] = 1760.000000000000000;
    noteFreq[6][11] = 1864.655046072359665;
    noteFreq[6][12] = 1975.533205024496447;

    noteFreq[7][1] = 2093.004522404789077;
    noteFreq[7][2] = 2217.461047814976769;
    noteFreq[7][3] = 2349.318143339260482;
    noteFreq[7][4] = 2489.015869776647285;
    noteFreq[7][5] = 2637.020455302959437;
    noteFreq[7][6] = 2793.825851464031075;
    noteFreq[7][7] = 2959.955381693075191;
    noteFreq[7][8] = 3135.963487853994352;
    noteFreq[7][9] = 3322.437580639561108;
    noteFreq[7][10] = 3520.000000000000000;
    noteFreq[7][11] = 3729.310092144719331;
    noteFreq[7][12] = 3951.066410048992894;

    noteFreq[8][1] = 4186.009044809578154;
    this.table = noteFreq;
}